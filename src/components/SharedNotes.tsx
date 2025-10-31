import { FileText, Download, BookOpen, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";

interface NoteCard {
  id: number;
  title: string;
  description: string;
  courseCode: string;
  uploadDate: string;

}

// dummy datalar
const notesData: Record<string, NoteCard[]> = {
  "1-1": [
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Fundamental programming concepts, variables, control structures",
      courseCode: "CS 101",
      uploadDate: "2024-01-15",

    },
    {
      id: 2,
      title: "Calculus I - Differential Equations",
      description: "Derivatives, limits, and basic calculus principles",
      courseCode: "MATH 101",
      uploadDate: "2024-01-12",
  
    },
    {
      id: 3,
      title: "Physics I - Mechanics",
      description: "Newton's laws, kinematics, and dynamics",
      courseCode: "PHYS 101",
      uploadDate: "2024-01-10",
      
    },
    {
      id: 4,
      title: "Linear Algebra",
      description: "Matrices, vectors, and linear transformations",
      courseCode: "MATH 102",
      uploadDate: "2024-01-08",
   
    }
  ],
  "1-2": [
    {
      id: 5,
      title: "Data Structures and Algorithms",
      description: "Arrays, linked lists, stacks, queues, and trees",
      courseCode: "CS 102",
      uploadDate: "2024-02-15",

    },
    {
      id: 6,
      title: "Discrete Mathematics",
      description: "Logic, sets, relations, and graph theory basics",
      courseCode: "MATH 103",
      uploadDate: "2024-02-12",
    
    },
    {
      id: 7,
      title: "Physics II - Electricity and Magnetism",
      description: "Electric fields, circuits, and magnetic forces",
      courseCode: "PHYS 102",
      uploadDate: "2024-02-10",
   
    }
  ],
  "2-1": [
    {
      id: 8,
      title: "Object-Oriented Programming",
      description: "Classes, inheritance, polymorphism, and design patterns",
      courseCode: "CS 201",
      uploadDate: "2024-01-20",
      
    },
    {
      id: 9,
      title: "Database Management Systems",
      description: "SQL queries, normalization, and ER modeling",
      courseCode: "CS 202",
      uploadDate: "2024-01-18"
     
    },
    {
      id: 10,
      title: "Computer Organization",
      description: "CPU architecture, memory hierarchy, and assembly",
      courseCode: "CS 203",
      uploadDate: "2024-01-15"
   
    },
    {
      id: 11,
      title: "Probability and Statistics",
      description: "Random variables, distributions, and hypothesis testing",
      courseCode: "MATH 201",
      uploadDate: "2024-01-12",
     
    }
  ],
  "2-2": [
    {
      id: 12,
      title: "Operating Systems",
      description: "Process management, memory, file systems, and virtualization",
      courseCode: "CS 204",
      uploadDate: "2024-02-18",
      
    },
    {
      id: 13,
      title: "Data Structures and Algorithms II",
      description: "Graph algorithms, dynamic programming, and complexity",
      courseCode: "CS 205",
      uploadDate: "2024-02-15",
   
    },
    {
      id: 14,
      title: "Computer Networks",
      description: "OSI model, TCP/IP, routing, and network protocols",
      courseCode: "CS 206",
      uploadDate: "2024-02-12",
      
    }
  ],
  "3-1": [
    {
      id: 15,
      title: "Software Engineering",
      description: "SDLC, design patterns, testing, and project management",
      courseCode: "CS 301",
      uploadDate: "2024-01-22",
    
    },
    {
      id: 16,
      title: "Machine Learning Fundamentals",
      description: "Supervised/unsupervised learning, neural networks basics",
      courseCode: "CS 302",
      uploadDate: "2024-01-20",
    
    },
    {
      id: 17,
      title: "Compiler Design",
      description: "Lexical analysis, parsing, code generation",
      courseCode: "CS 303",
      uploadDate: "2024-01-18",
     
    },
    {
      id: 18,
      title: "Algorithm Design and Analysis",
      description: "Advanced algorithms, greedy, divide and conquer",
      courseCode: "CS 304",
      uploadDate: "2024-01-15",
  
    }
  ],
  "3-2": [
    {
      id: 19,
      title: "Artificial Intelligence",
      description: "Search algorithms, knowledge representation, planning",
      courseCode: "CS 305",
      uploadDate: "2024-02-20",
     
    },
    {
      id: 20,
      title: "Computer Graphics",
      description: "Rendering, transformations, 3D modeling basics",
      courseCode: "CS 306",
      uploadDate: "2024-02-18",
      
    },
    {
      id: 21,
      title: "Cybersecurity",
      description: "Cryptography, network security, ethical hacking",
      courseCode: "CS 307",
      uploadDate: "2024-02-15",
 
    }
  ],
  "4-1": [
    {
      id: 22,
      title: "Deep Learning",
      description: "CNN, RNN, transformers, and advanced neural networks",
      courseCode: "CS 401",
      uploadDate: "2024-01-24",
    
    },
    {
      id: 23,
      title: "Distributed Systems",
      description: "Consistency, consensus, cloud computing, microservices",
      courseCode: "CS 402",
      uploadDate: "2024-01-22",
     
    },
    {
      id: 24,
      title: "Natural Language Processing",
      description: "Text processing, NLP models, transformers",
      courseCode: "CS 403",
      uploadDate: "2024-01-20",
      
    }
  ],
  "4-2": [
    {
      id: 25,
      title: "Senior Capstone Project",
      description: "Full-stack development project and documentation",
      courseCode: "CS 404",
      uploadDate: "2024-02-24",
     
    },
    {
      id: 26,
      title: "Cloud Computing",
      description: "AWS, Azure, containerization, serverless architecture",
      courseCode: "CS 405",
      uploadDate: "2024-02-22",
    
    },
    {
      id: 27,
      title: "Blockchain Technology",
      description: "Cryptography, consensus, smart contracts, DeFi",
      courseCode: "CS 406",
      uploadDate: "2024-02-20",
     
    }
  ]
};

export default function SharedNotes() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  const classes = [
    { id: "1", name: "1st Year",  color: "bg-blue-500" },
    { id: "2", name: "2nd Year",  color: "bg-green-500" },
    { id: "3", name: "3rd Year",  color: "bg-purple-500" },
    { id: "4", name: "4th Year",  color: "bg-orange-500" }
  ];

  const handleDownload = (noteId: number) => {
    console.log(`Downloading note ${noteId}`);
    // Implement download logic here
  };

  const handleBackToClasses = () => {
    setSelectedClass(null);
    setSelectedSemester(null);
  };

  const handleBackToSemesters = () => {
    setSelectedSemester(null);
  };

  const getCurrentNotes = () => {
    if (selectedClass && selectedSemester) {
      const key = `${selectedClass}-${selectedSemester}`;
      return notesData[key] || [];
    }
    return [];
  };

  // Show class selection
  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shared Notes
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              Browse notes by class and semester - Computer Engineering
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => setSelectedClass(classItem.id)}
                className="bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-purple-500 transition-all duration-200 p-8 text-center group hover:shadow-xl hover:-translate-y-2"
              >
                <div className={`${classItem.color} w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                  
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{classItem.name}</h3>
                <p className="text-gray-600 mt-2">Select to view notes</p>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show semester selection
  if (!selectedSemester) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-purple-700 text-white">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center">
            <button
              onClick={handleBackToClasses}
              className="absolute left-4 md:left-8 text-purple-100 hover:text-white mb-4 flex items-center gap-2"
            >
              <ChevronRight className="rotate-180" size={20} /> Back to Classes
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {classes.find(c => c.id === selectedClass)?.name} - Select Semester
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              Choose a semester to view available notes
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-2">
            <button
              onClick={() => setSelectedSemester("1")}
              className="bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-purple-500 transition-all duration-200 p-8 text-center group hover:shadow-xl hover:-translate-y-2"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="text-purple-700" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">1st Semester</h3>
              <p className="text-gray-600 mt-2">Fall courses</p>
            </button>

            <button
              onClick={() => setSelectedSemester("2")}
              className="bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-purple-500 transition-all duration-200 p-8 text-center group hover:shadow-xl hover:-translate-y-2"
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="text-purple-700" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">2nd Semester</h3>
              <p className="text-gray-600 mt-2">Spring courses</p>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show notes for selected class and semester
  const currentNotes = getCurrentNotes();
  const currentClass = classes.find(c => c.id === selectedClass);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-purple-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <button
            onClick={handleBackToSemesters}
            className="text-purple-100 hover:text-white mb-4 flex items-center gap-2"
          >
            <ChevronRight className="rotate-180" size={20} /> Back to Semesters
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {currentClass?.name} - Semester {selectedSemester}
          </h1>
          <p className="text-lg text-purple-100">
            Available notes ({currentNotes.length} files)
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {currentNotes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <BookOpen className="text-purple-700" size={24} />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-purple-700 font-medium mb-2">
                    {note.courseCode}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {note.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(note.uploadDate).toLocaleDateString()}
                    </div>
                   
                  </div>

                  

                  <button
                    onClick={() => handleDownload(note.id)}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FileText className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notes available</h3>
            <p className="text-gray-500">Notes for this semester are coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
}
