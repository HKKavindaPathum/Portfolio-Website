'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, FileText, Plus, Edit2, Trash2, LogOut, Loader2, Save } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubLink?: string | null;
  liveLink?: string | null;
  imageUrl?: string | null;
}

interface CvDetails {
  fullName: string;
  professionalTitle: string;
  aboutSummary: string;
  cvUrl: string;
}

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'cv'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [cvDetails, setCvDetails] = useState<CvDetails>({
    fullName: '',
    professionalTitle: '',
    aboutSummary: '',
    cvUrl: '',
  });

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [savingCv, setSavingCv] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    imageUrl: '',
  });
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Fetch initial dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, cvRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/cv'),
        ]);

        const projData = await projRes.json();
        const cvData = await cvRes.json();

        if (projData.success) setProjects(projData.data);
        if (cvData.success) setCvDetails(cvData.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      router.push('/backdoor-admin');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Manage CV details submission
  const handleCvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCv(true);
    setError(null);

    try {
      const res = await fetch('/api/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvDetails),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('CV details updated successfully!');
      } else {
        setError(data.error || 'Failed to update CV');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving.');
    } finally {
      setSavingCv(false);
    }
  };

  // Manage Project creation / modification
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setError(null);

    const isEdit = editingProjectId !== null;
    const url = '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload = isEdit ? { ...projectForm, id: editingProjectId } : projectForm;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isEdit) {
          setProjects(projects.map((p) => (p.id === editingProjectId ? data.data : p)));
        } else {
          setProjects([data.data, ...projects]);
        }
        // Reset Project Form
        setProjectForm({
          title: '',
          description: '',
          techStack: '',
          githubLink: '',
          liveLink: '',
          imageUrl: '',
        });
        setEditingProjectId(null);
        alert(isEdit ? 'Project updated!' : 'Project created!');
      } else {
        setError(data.error || 'Failed to save project');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving project.');
    } finally {
      setSavingProject(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        setError(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting project.');
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      imageUrl: project.imageUrl || '',
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500 mr-2" />
        <span>Loading admin controls...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-white">ADMIN.DASHBOARD</span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
              Secure
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:bg-zinc-850 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <button
            onClick={() => {
              setActiveTab('projects');
              setError(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all border ${
              activeTab === 'projects'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Briefcase size={18} />
            Manage Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('cv');
              setError(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all border ${
              activeTab === 'cv'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <FileText size={18} />
            Manage CV & Profile
          </button>
        </aside>

        {/* Display Forms / Operations */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Add/Edit project Form */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  {editingProjectId ? <Edit2 size={18} /> : <Plus size={18} />}
                  {editingProjectId ? 'Modify Project details' : 'Add New Project'}
                </h2>

                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project Title</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="e.g. Portfolio Website"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        required
                        value={projectForm.techStack || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="e.g. Next.js, Tailwind CSS, Prisma"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={projectForm.description || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none resize-none"
                      placeholder="Describe your project, core features, and technical details..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub Link</label>
                      <input
                        type="url"
                        value={projectForm.githubLink || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Demo Link</label>
                      <input
                        type="url"
                        value={projectForm.liveLink || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, liveLink: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Image Preview URL</label>
                      <input
                        type="text"
                        value={projectForm.imageUrl || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="https://example.com/screenshot.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProjectId(null);
                          setProjectForm({
                            title: '',
                            description: '',
                            techStack: '',
                            githubLink: '',
                            liveLink: '',
                            imageUrl: '',
                          });
                        }}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={savingProject}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg transition-colors"
                    >
                      {savingProject ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          {editingProjectId ? 'Save Changes' : 'Create Project'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Current Projects ({projects.length})</h3>

                {projects.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic">No projects found. Add one above.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-800 transition-colors"
                      >
                        <div>
                          <h4 className="font-bold text-white text-lg">{project.title}</h4>
                          <p className="text-xs text-zinc-500 mt-1 font-semibold tracking-wider uppercase">{project.techStack}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditProject(project)}
                            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 rounded-lg transition-colors border border-zinc-800"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors border border-zinc-800"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CV DETAILS */}
          {activeTab === 'cv' && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <FileText size={18} />
                Manage Profile & CV Link
              </h2>

              <form onSubmit={handleCvSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={cvDetails.fullName}
                      onChange={(e) => setCvDetails({ ...cvDetails, fullName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Professional Title</label>
                    <input
                      type="text"
                      required
                      value={cvDetails.professionalTitle}
                      onChange={(e) => setCvDetails({ ...cvDetails, professionalTitle: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. Lead Full-Stack Architect"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Biography Summary</label>
                  <textarea
                    required
                    rows={6}
                    value={cvDetails.aboutSummary}
                    onChange={(e) => setCvDetails({ ...cvDetails, aboutSummary: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none resize-none leading-relaxed"
                    placeholder="Tell your professional story, core values, philosophy..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">CV Document URL (PDF/Drive Link)</label>
                  <input
                    type="text"
                    required
                    value={cvDetails.cvUrl}
                    onChange={(e) => setCvDetails({ ...cvDetails, cvUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingCv}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg transition-colors"
                  >
                    {savingCv ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
