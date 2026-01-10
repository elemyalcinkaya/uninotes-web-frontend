import { getApiUrl, API_ENDPOINTS } from "../config/api";
import { authService } from "./authService";

/* ===========================
   API REQUEST HELPER
=========================== */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authService.getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authService.logout();
      window.location.href = "/login";
    }

    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));

    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/* ===========================
   FILE UPLOAD HELPER
=========================== */
async function apiFileUpload(
  endpoint: string,
  formData: FormData
): Promise<any> {
  const token = authService.getToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authService.logout();
      window.location.href = "/login";
    }

    const error = await response
      .json()
      .catch(() => ({ message: "Upload failed" }));

    throw new Error(error.message || "Upload failed");
  }

  return response.json();
}

/* ===========================
   FILE DOWNLOAD HELPER
=========================== */
async function downloadFile(
  fileId: number,
  fileName: string
): Promise<void> {
  const token = authService.getToken();

  const response = await fetch(
    getApiUrl(API_ENDPOINTS.FILES.DOWNLOAD(fileId)),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/* ===========================
   TYPES
=========================== */
export interface Note {
  id: number;
  title: string;
  courseCode?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  fileCount?: number;
  classLevel: number;
  semester: number;

  sharedBy?: {
    id: number;
    name: string;
    email?: string;
  };
}

/* 🔴 API FILE MODEL – adı değiştirildi */
export interface NoteFile {
  id: number;
  noteId?: number;
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  courseCode?: string;
  summary?: string;
  classLevel: number;
  semester: number;
  isShared?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  courseCode?: string;
  summary?: string;
  isShared?: boolean;
}

export interface ContactMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName?: string;
  classLevel: number;
  semester: number;
  isElective: boolean;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

export interface NoteTag {
  id: number;
  noteId: number;
  tagId: number;
  tag?: Tag;
}

export interface Favorite {
  id: number;
  userId: number;
  noteId: number;
  createdAt: string;
  note?: Note;
}

export interface Download {
  id: number;
  userId: number;
  noteId: number;
  fileId: number;
  downloadedAt: string;
}

export interface ReportReason {
  id: number;
  reasonText: string;
  createdAt: string;
}

export interface Report {
  id: number;
  noteId: number;
  userId: number;
  reportReasonId: number;
  createdAt: string;
  note?: Note;
  reportReason?: ReportReason;
}



/* ===========================
   API SERVICE
=========================== */
export const apiService = {
  /* ---------- NOTES ---------- */
  notes: {
    async getAll(): Promise<Note[]> {
      return apiRequest<Note[]>(API_ENDPOINTS.NOTES.LIST);
    },

    async getShared(
      classLevel?: number,
      semester?: number
    ): Promise<Note[]> {
      const params = new URLSearchParams();

      if (classLevel) params.append("classLevel", classLevel.toString());
      if (semester) params.append("semester", semester.toString());

      const query = params.toString()
        ? `?${params.toString()}`
        : "";

      return apiRequest<Note[]>(
        `${API_ENDPOINTS.NOTES.SHARED}${query}`
      );
    },


    async getById(id: number): Promise<Note & { files: NoteFile[] }> {
      return apiRequest<Note & { files: NoteFile[] }>(
        API_ENDPOINTS.NOTES.GET(id)
      );
    },

    async create(note: CreateNoteDto): Promise<Note> {
      return apiRequest<Note>(API_ENDPOINTS.NOTES.CREATE, {
        method: "POST",
        body: JSON.stringify(note),
      });
    },

    async update(id: number, note: UpdateNoteDto): Promise<Note> {
      return apiRequest<Note>(API_ENDPOINTS.NOTES.UPDATE(id), {
        method: "PUT",
        body: JSON.stringify(note),
      });
    },

    async delete(id: number): Promise<void> {
      return apiRequest<void>(API_ENDPOINTS.NOTES.DELETE(id), {
        method: "DELETE",
      });
    },
    async getMyNotes(): Promise<Note[]> {
      return apiRequest<Note[]>("/notes/my");
    },

  },

  /* ---------- FILES ---------- */
  files: {
    async getAll(noteId?: number): Promise<NoteFile[]> {
      const endpoint = noteId
        ? `${API_ENDPOINTS.FILES.LIST}?noteId=${noteId}`
        : API_ENDPOINTS.FILES.LIST;

      return apiRequest<NoteFile[]>(endpoint);
    },

    async upload(
      file: globalThis.File,   // 🔥 TARAYICI FILE
      noteId?: number,
      title?: string
    ): Promise<NoteFile> {
      const formData = new FormData();
      formData.append("file", file);

      if (noteId) {
        formData.append("noteId", noteId.toString());
      }

      if (title) {
        formData.append("title", title);
      }

      const response = await apiFileUpload(
        API_ENDPOINTS.FILES.UPLOAD,
        formData
      );

      return response.file;
    },

    async download(fileId: number, fileName: string): Promise<void> {
      return downloadFile(fileId, fileName);
    },

    async delete(id: number): Promise<void> {
      return apiRequest<void>(API_ENDPOINTS.FILES.DELETE(id), {
        method: "DELETE",
      });
    },
  },

  /* ---------- CONTACT ---------- */
  contact: {
    async send(data: ContactMessageDto): Promise<void> {
      return apiRequest<void>(API_ENDPOINTS.CONTACT.SEND, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  /* ---------- COURSES ---------- */
  courses: {
    async getAll(): Promise<Course[]> {
      return apiRequest<Course[]>(API_ENDPOINTS.COURSES.LIST);
    },

    async getByClassLevelAndSemester(
      classLevel: number,
      semester: number
    ): Promise<Course[]> {
      return apiRequest<Course[]>(
        API_ENDPOINTS.COURSES.BY_CLASS_AND_SEMESTER(classLevel, semester)
      );
    },
  },

  /* ---------- TAGS ---------- */
  tags: {
    async getAll(): Promise<Tag[]> {
      return apiRequest<Tag[]>("/tags");
    },

    async getPopular(): Promise<Tag[]> {
      return apiRequest<Tag[]>("/tags/popular");
    },
  },

  /* ---------- FAVORITES ---------- */
  favorites: {
    async getMyFavorites(): Promise<Favorite[]> {
      return apiRequest<Favorite[]>("/favorites/my");
    },

    async add(noteId: number): Promise<Favorite> {
      return apiRequest<Favorite>("/favorites", {
        method: "POST",
        body: JSON.stringify({ noteId }),
      });
    },

    async remove(noteId: number): Promise<void> {
      return apiRequest<void>(`/favorites/${noteId}`, {
        method: "DELETE",
      });
    },

    async check(noteId: number): Promise<boolean> {
      return apiRequest<boolean>(`/favorites/check/${noteId}`);
    },
  },

  /* ---------- DOWNLOADS ---------- */
  downloads: {
    async track(noteId: number, fileId: number): Promise<Download> {
      return apiRequest<Download>(API_ENDPOINTS.DOWNLOADS.TRACK, {
        method: "POST",
        body: JSON.stringify({ noteId, fileId }),
      });
    },

    async getMyDownloads(): Promise<Download[]> {
      return apiRequest<Download[]>(API_ENDPOINTS.DOWNLOADS.MY);
    },
  },

  /* ---------- REPORTS ---------- */
  reports: {
    async create(noteId: number, reportReasonId: number): Promise<void> {
      return apiRequest<void>(API_ENDPOINTS.REPORTS.CREATE, {
        method: "POST",
        body: JSON.stringify({ noteId, reportReasonId }),
      });
    },

    async getAll(): Promise<Report[]> {
      return apiRequest<Report[]>(API_ENDPOINTS.REPORTS.LIST);
    },
  },

  /* ---------- REPORT REASONS ---------- */
  reportReasons: {
    async getAll(): Promise<ReportReason[]> {
      return apiRequest<ReportReason[]>(API_ENDPOINTS.REPORT_REASONS.LIST);
    },
  },
};
