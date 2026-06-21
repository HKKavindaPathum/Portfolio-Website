'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import {
  Briefcase,
  FileText,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  Loader2,
  Save,
  GraduationCap,
  Award,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;
  githubLink?: string | null;
  githubBackendLink?: string | null;
  liveLink?: string | null;
  imageUrl?: string | null;
  imageFile?: string | null;
  order?: number;
}

interface CvDetails {
  fullName: string;
  professionalTitle: string;
  aboutSummary: string;
  cvUrl: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  statsExperience?: string | null;
  statsProjects?: string | null;
  statsTechnologies?: string | null;
  heroDescription?: string | null;
  cvFile?: string | null;
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface Skill {
  id: number;
  name: string;
  categoryId?: number;
  category: string;
  order?: number;
}

interface SkillCategory {
  id: number;
  name: string;
  order: number;
}

export default function DashboardClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'cv' | 'education' | 'skills'>('cv');
  
  // Data lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [cvDetails, setCvDetails] = useState<CvDetails>({
    fullName: '',
    professionalTitle: '',
    aboutSummary: '',
    cvUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    phone: '',
    location: '',
    statsExperience: '',
    statsProjects: '',
    statsTechnologies: '',
    heroDescription: '',
    cvFile: '',
  });
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [categoriesList, setCategoriesList] = useState<SkillCategory[]>([]);

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [savingCv, setSavingCv] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [savingEducation, setSavingEducation] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    githubBackendLink: '',
    liveLink: '',
    imageUrl: '',
    imageFile: '',
  });
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Education Form State
  const [educationForm, setEducationForm] = useState<Partial<Education>>({
    degree: '',
    institution: '',
    period: '',
    description: '',
  });
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null);

  // Skill Form State
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: '',
    categoryId: undefined,
  });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState<{ name: string }>({ name: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  // Fetch initial dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, cvRes, eduRes, skillRes, catRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/cv'),
          fetch('/api/education'),
          fetch('/api/skills'),
          fetch('/api/skills/categories'),
        ]);

        const projData = await projRes.json();
        const cvData = await cvRes.json();
        const eduData = await eduRes.json();
        const skillData = await skillRes.json();
        const catData = await catRes.json();

        if (projData.success) setProjects(projData.data);
        if (cvData.success) setCvDetails(cvData.data);
        if (eduData.success) {
          const sortedEdu = [...eduData.data].sort((a, b) => b.id - a.id);
          setEducationList(sortedEdu);
        }
        if (skillData.success) setSkillsList(skillData.data);
        if (catData.success) setCategoriesList(catData.data);
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

  // 1. CV Submit
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
        toast.success('CV details updated successfully!');
      } else {
        setError(data.error || 'Failed to update CV');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving CV.');
    } finally {
      setSavingCv(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Please upload a file smaller than 5MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1] || base64String;
      setCvDetails((prev) => ({ ...prev, cvFile: base64Data }));
    };
    reader.onerror = (error) => {
      console.error('Error reading PDF file:', error);
      toast.error('Failed to read PDF file.');
    };
    reader.readAsDataURL(file);
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file only.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setProjectForm((prev) => ({ ...prev, imageFile: dataUrl }));
        } else {
          toast.error('Failed to process image.');
        }
      };
      img.onerror = () => {
        toast.error('Failed to load image file.');
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => {
      console.error('Error reading image file:', error);
      toast.error('Failed to read image file.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 2. Project Submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setError(null);

    const isEdit = editingProjectId !== null;
    const url = '/api/projects';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload: any = isEdit ? { ...projectForm, id: editingProjectId } : { ...projectForm };

      // Handle image updates selectively
      if (isEdit) {
        if (payload.imageFile === undefined || payload.imageFile?.startsWith('/api/projects/image')) {
          delete payload.imageFile;
        } else if (!payload.imageFile) {
          payload.imageFile = null;
        }
      } else {
        if (!payload.imageFile) {
          payload.imageFile = null;
        }
      }

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
        setProjectForm({
          title: '',
          description: '',
          techStack: '',
          githubLink: '',
          githubBackendLink: '',
          liveLink: '',
          imageUrl: '',
          imageFile: '',
        });
        setEditingProjectId(null);
        toast.success(isEdit ? 'Project updated successfully!' : 'Project created successfully!');
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
    const isDbImage = project.imageUrl?.startsWith('/api/projects/image');
    setProjectForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      githubLink: project.githubLink || '',
      githubBackendLink: project.githubBackendLink || '',
      liveLink: project.liveLink || '',
      imageUrl: isDbImage ? '' : (project.imageUrl || ''),
      imageFile: isDbImage ? project.imageUrl : undefined,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Education Submit
  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEducation(true);
    setError(null);

    const isEdit = editingEducationId !== null;
    const url = '/api/education';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload = isEdit ? { ...educationForm, id: editingEducationId } : educationForm;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isEdit) {
          setEducationList(
            educationList.map((item) => (item.id === editingEducationId ? data.data : item))
          );
        } else {
          setEducationList([data.data, ...educationList]);
        }
        setEducationForm({
          degree: '',
          institution: '',
          period: '',
          description: '',
        });
        setEditingEducationId(null);
        toast.success(isEdit ? 'Education entry updated successfully!' : 'Education entry created successfully!');
      } else {
        setError(data.error || 'Failed to save education entry');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving education.');
    } finally {
      setSavingEducation(false);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
      const res = await fetch(`/api/education?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEducationList(educationList.filter((item) => item.id !== id));
      } else {
        setError(data.error || 'Failed to delete education entry');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting education.');
    }
  };

  const startEditEducation = (item: Education) => {
    setEditingEducationId(item.id);
    setEducationForm({
      degree: item.degree,
      institution: item.institution,
      period: item.period,
      description: item.description,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Skills Submit
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSkill(true);
    setError(null);

    const isEdit = editingSkillId !== null;
    const url = '/api/skills';
    const method = isEdit ? 'PUT' : 'POST';

    const categoryId = skillForm.categoryId;

    if (!categoryId) {
      toast.error('Please select a category.');
      setSavingSkill(false);
      return;
    }

    try {
      const payload = isEdit
        ? { id: editingSkillId, name: skillForm.name, categoryId }
        : { name: skillForm.name, categoryId };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isEdit) {
          setSkillsList(
            skillsList.map((item) => (item.id === editingSkillId ? data.data : item))
          );
        } else {
          setSkillsList([...skillsList, data.data]);
        }
        setSkillForm({
          name: '',
          categoryId: categoriesList[0]?.id || undefined,
        });
        setEditingSkillId(null);
        toast.success(isEdit ? 'Skill updated successfully!' : 'Skill created successfully!');
      } else {
        toast.error(data.error || 'Failed to save skill');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving skill.');
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const res = await fetch(`/api/skills?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSkillsList(skillsList.filter((item) => item.id !== id));
        toast.success('Skill deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete skill');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting skill.');
    }
  };

  const startEditSkill = (item: Skill) => {
    setEditingSkillId(item.id);
    setSkillForm({
      name: item.name,
      categoryId: item.categoryId,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 5. Category CRUD Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategory(true);
    setError(null);

    const isEdit = editingCategoryId !== null;
    const url = '/api/skills/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const payload = isEdit
        ? { id: editingCategoryId, name: categoryForm.name }
        : { name: categoryForm.name };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isEdit) {
          setCategoriesList(
            categoriesList.map((item) => (item.id === editingCategoryId ? data.data : item))
          );
          setSkillsList(
            skillsList.map((skill) =>
              skill.categoryId === editingCategoryId
                ? { ...skill, category: data.data.name }
                : skill
            )
          );
        } else {
          setCategoriesList([...categoriesList, data.data]);
        }
        setCategoryForm({ name: '' });
        setEditingCategoryId(null);
        toast.success(isEdit ? 'Category updated successfully!' : 'Category created successfully!');
      } else {
        toast.error(data.error || 'Failed to save category');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while saving category.');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    const hasSkills = skillsList.some((s) => s.categoryId === id);
    if (hasSkills) {
      toast.error('Cannot delete category while it has skills. Remove all skills first.');
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/skills/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategoriesList(categoriesList.filter((item) => item.id !== id));
        toast.success('Category deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting category.');
    }
  };

  const startEditCategory = (item: SkillCategory) => {
    setEditingCategoryId(item.id);
    setCategoryForm({ name: item.name });
  };

  // 6. Reordering Handlers
  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= categoriesList.length) return;

    const newList = [...categoriesList];
    const temp = newList[index];
    newList[index] = newList[nextIndex];
    newList[nextIndex] = temp;

    setCategoriesList(newList);

    try {
      const res = await fetch('/api/skills/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          ids: newList.map((c) => c.id),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to save category order');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while reordering categories');
    }
  };

  const handleMoveSkill = async (skillId: number, categoryId: number, direction: 'up' | 'down') => {
    const categorySkills = skillsList.filter((s) => s.categoryId === categoryId);
    const index = categorySkills.findIndex((s) => s.id === skillId);
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= categorySkills.length) return;

    const swappedSkills = [...categorySkills];
    const temp = swappedSkills[index];
    swappedSkills[index] = swappedSkills[nextIndex];
    swappedSkills[nextIndex] = temp;

    const newList = [];
    let swappedIndex = 0;
    for (const skill of skillsList) {
      if (skill.categoryId === categoryId) {
        newList.push(swappedSkills[swappedIndex++]);
      } else {
        newList.push(skill);
      }
    }

    setSkillsList(newList);

    try {
      const res = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          ids: newList.map((s) => s.id),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to save skills order');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while reordering skills');
    }
  };

  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= projects.length) return;

    const newList = [...projects];
    const temp = newList[index];
    newList[index] = newList[nextIndex];
    newList[nextIndex] = temp;

    setProjects(newList);

    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          ids: newList.map((p) => p.id),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to save projects order');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while reordering projects');
    }
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
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#f4f4f5', border: '1px solid #27272a' } }} />
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
        {/* Navigation Sidebar (Manage CV & Profile is now at the top) */}
        <aside className="lg:col-span-1 space-y-2">
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
            Manage Profile & CV
          </button>

          <button
            onClick={() => {
              setActiveTab('education');
              setError(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all border ${
              activeTab === 'projects'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Briefcase size={18} />
            Manage Education
          </button>

          <button
            onClick={() => {
              setActiveTab('skills');
              setError(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all border ${
              activeTab === 'education'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <GraduationCap size={18} />
            Manage Skills
          </button>

          <button
            onClick={() => {
              setActiveTab('projects');
              setError(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all border ${
              activeTab === 'skills'
                ? 'bg-violet-600/10 text-violet-400 border-violet-500/20'
                : 'bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Award size={18} />
            Manage Projects
          </button>
        </aside>

        {/* Display Forms / Operations */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* TAB 1: CV DETAILS */}
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
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Hero Section Tagline</label>
                  <textarea
                    required
                    rows={3}
                    value={cvDetails.heroDescription || ''}
                    onChange={(e) => setCvDetails({ ...cvDetails, heroDescription: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none resize-none leading-relaxed"
                    placeholder="Brief intro tagline displayed under your title in the hero section..."
                  />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Upload CV PDF (Overrides URL)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-[9px] text-xs text-zinc-400 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                      />
                      {cvDetails.cvFile && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={cvDetails.githubUrl || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, githubUrl: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={cvDetails.linkedinUrl || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, linkedinUrl: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Contact Email</label>
                    <input
                      type="email"
                      value={cvDetails.email || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, email: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. hello@domain.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      value={cvDetails.phone || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. +94 740 707 321"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={cvDetails.location || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, location: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. Sri Lanka"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Years of Experience</label>
                    <input
                      type="text"
                      required
                      value={cvDetails.statsExperience || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, statsExperience: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. 5+"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Projects Completed</label>
                    <input
                      type="text"
                      required
                      value={cvDetails.statsProjects || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, statsProjects: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. 30+"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Technologies Used</label>
                    <input
                      type="text"
                      required
                      value={cvDetails.statsTechnologies || ''}
                      onChange={(e) => setCvDetails({ ...cvDetails, statsTechnologies: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. 15+"
                    />
                  </div>
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

          {/* TAB 2: PROJECTS */}
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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub Link (Frontend)</label>
                      <input
                        type="url"
                        value={projectForm.githubLink || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">GitHub Link (Backend)</label>
                      <input
                        type="url"
                        value={projectForm.githubBackendLink || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, githubBackendLink: e.target.value })}
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
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project Image</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center justify-center px-4 py-2.5 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-850 cursor-pointer transition-colors focus-within:ring-1 focus-within:ring-violet-500">
                            <span>Upload Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProjectImageUpload}
                              className="sr-only"
                            />
                          </label>
                          {projectForm.imageFile && (
                            <button
                              type="button"
                              onClick={() => setProjectForm({ ...projectForm, imageFile: '' })}
                              className="text-xs text-rose-500 hover:text-rose-400 underline font-medium"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                        {projectForm.imageFile && (
                          <div className="relative w-24 h-16 rounded border border-zinc-800 overflow-hidden bg-zinc-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={projectForm.imageFile}
                              alt="Upload preview"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        {!projectForm.imageFile && (
                          <div>
                            <input
                              type="text"
                              value={projectForm.imageUrl || ''}
                              onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                              className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-xs text-zinc-200 outline-none"
                              placeholder="Or enter image URL: https://example.com/image.jpg"
                            />
                          </div>
                        )}
                      </div>
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
                            githubBackendLink: '',
                            liveLink: '',
                            imageUrl: '',
                            imageFile: '',
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
                    {projects.map((project, index) => (
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
                            onClick={() => handleMoveProject(index, 'up')}
                            disabled={index === 0}
                            className={`p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 rounded-lg transition-colors border border-zinc-800 ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title="Move Up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveProject(index, 'down')}
                            disabled={index === projects.length - 1}
                            className={`p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 rounded-lg transition-colors border border-zinc-800 ${index === projects.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title="Move Down"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            onClick={() => startEditProject(project)}
                            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 rounded-lg transition-colors border border-zinc-800"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-450 rounded-lg transition-colors border border-zinc-800"
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

          {/* TAB 3: EDUCATION TIMELINE */}
          {activeTab === 'education' && (
            <div className="space-y-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                  {editingEducationId ? <Edit2 size={18} /> : <Plus size={18} />}
                  {editingEducationId ? 'Modify Education Entry' : 'Add New Education Entry'}
                </h2>

                <form onSubmit={handleEducationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Degree / Qualification</label>
                      <input
                        type="text"
                        required
                        value={educationForm.degree || ''}
                        onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="e.g. G.C.E. Advanced Level"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Institution / School</label>
                      <input
                        type="text"
                        required
                        value={educationForm.institution || ''}
                        onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="e.g. Eastern University of Sri Lanka"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Period</label>
                      <input
                        type="text"
                        required
                        value={educationForm.period || ''}
                        onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        placeholder="e.g. 2019 or 08/2021 - 12/2024"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex justify-between">
                      <span>Description / Subject Grades</span>
                      <span className="text-[10px] text-zinc-550 lowercase italic font-normal">Use Enter/Newlines to list vertically</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={educationForm.description || ''}
                      onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none resize-none leading-relaxed"
                      placeholder="e.g. Combined Mathematics : C&#10;Physics : S&#10;ICT : C"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {editingEducationId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEducationId(null);
                          setEducationForm({
                            degree: '',
                            institution: '',
                            period: '',
                            description: '',
                          });
                        }}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={savingEducation}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg transition-colors"
                    >
                      {savingEducation ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          {editingEducationId ? 'Save Changes' : 'Add Entry'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Education List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Current Timeline ({educationList.length})</h3>

                {educationList.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic">No entries found. Add one above.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {educationList.map((item) => (
                      <div
                        key={`admin-edu-${item.id}`}
                        className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-800 transition-colors"
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-lg">{item.degree}</h4>
                          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{item.institution} ({item.period})</p>
                          <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed italic">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => startEditEducation(item)}
                            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-violet-400 rounded-lg transition-colors border border-zinc-800"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(item.id)}
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

          {/* TAB 4: SKILLS & TECHNOLOGIES */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Skill Categories Section */}
              <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award size={18} />
                  {editingCategoryId ? 'Modify Category' : 'Add New Category'}
                </h2>
                
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category Name</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                      placeholder="e.g. Programming Languages"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setCategoryForm({ name: '' });
                        }}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={savingCategory}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg transition-colors"
                    >
                      {savingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save size={12} />}
                      {editingCategoryId ? 'Save' : 'Add'}
                    </button>
                  </div>
                </form>
                
                <div className="w-full h-px bg-zinc-800" />
                
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Existing Categories ({categoriesList.length})</h3>
                  {categoriesList.length === 0 ? (
                    <p className="text-zinc-650 text-xs italic">No categories created yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {categoriesList.map((cat, idx) => (
                        <div
                          key={`admin-cat-${cat.id}`}
                          className="flex items-center justify-between p-3.5 bg-zinc-950/40 border border-zinc-850 rounded-xl text-sm"
                        >
                          <span className="font-semibold text-zinc-300">{cat.name}</span>
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              onClick={() => handleMoveCategory(idx, 'up')}
                              disabled={idx === 0}
                              className={`p-1 bg-zinc-900 text-zinc-500 hover:text-violet-400 rounded transition-colors ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              onClick={() => handleMoveCategory(idx, 'down')}
                              disabled={idx === categoriesList.length - 1}
                              className={`p-1 bg-zinc-900 text-zinc-500 hover:text-violet-400 rounded transition-colors ${idx === categoriesList.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              onClick={() => startEditCategory(cat)}
                              className="p-1 bg-zinc-900 text-zinc-500 hover:text-violet-400 transition-colors rounded"
                              title="Rename"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 bg-zinc-900 text-zinc-500 hover:text-rose-450 transition-colors rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="lg:col-span-7 space-y-8">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    {editingSkillId ? <Edit2 size={18} /> : <Plus size={18} />}
                    {editingSkillId ? 'Modify Skill Badge' : 'Add New Skill Badge'}
                  </h2>

                  <form onSubmit={handleSkillSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Skill Name</label>
                        <input
                          type="text"
                          required
                          value={skillForm.name || ''}
                          onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                          placeholder="e.g. TypeScript or Docker"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</label>
                        <select
                          value={skillForm.categoryId || ''}
                          onChange={(e) => setSkillForm({ ...skillForm, categoryId: Number(e.target.value) })}
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-lg p-3 text-sm text-zinc-200 outline-none"
                        >
                          <option value="">-- Select Category --</option>
                          {categoriesList.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      {editingSkillId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkillId(null);
                            setSkillForm({
                              name: '',
                              categoryId: categoriesList[0]?.id || undefined,
                            });
                          }}
                          className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={savingSkill}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg transition-colors"
                      >
                        {savingSkill ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={14} />
                            {editingSkillId ? 'Save Changes' : 'Create Skill'}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Skills List */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Current Skill Badges</h3>

                  {skillsList.length === 0 ? (
                    <p className="text-zinc-500 text-sm italic">No skills found. Add one above.</p>
                  ) : (
                    <div className="space-y-6">
                      {categoriesList.map((category) => {
                        const items = skillsList.filter((s) => s.categoryId === category.id);
                        if (items.length === 0) return null;
                        
                        return (
                          <div key={`skill-cat-items-${category.id}`} className="space-y-3 bg-zinc-900/10 border border-zinc-850 rounded-2xl p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                              <Award size={14} />
                              {category.name}
                            </h4>
                            <div className="flex flex-wrap gap-2.5 pt-1">
                              {items.map((item, idx) => (
                                <div
                                  key={`admin-skill-${item.id}`}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm"
                                >
                                  <span className="font-semibold text-zinc-250">{item.name}</span>
                                  <div className="flex items-center border-l border-zinc-800 pl-2 ml-1 gap-1">
                                    <button
                                      onClick={() => handleMoveSkill(item.id, category.id, 'up')}
                                      disabled={idx === 0}
                                      className={`text-zinc-500 hover:text-violet-400 transition-colors ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                      title="Move Up"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleMoveSkill(item.id, category.id, 'down')}
                                      disabled={idx === items.length - 1}
                                      className={`text-zinc-500 hover:text-violet-400 transition-colors ${idx === items.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                      title="Move Down"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                    <button
                                      onClick={() => startEditSkill(item)}
                                      className="text-zinc-500 hover:text-violet-400 transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSkill(item.id)}
                                      className="text-zinc-500 hover:text-rose-450 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Render uncategorized skills if any */}
                      {(() => {
                        const catIds = categoriesList.map((c) => c.id);
                        const uncategorized = skillsList.filter((s) => !s.categoryId || !catIds.includes(s.categoryId));
                        if (uncategorized.length === 0) return null;
                        
                        return (
                          <div className="space-y-3 bg-zinc-900/10 border border-zinc-850 rounded-2xl p-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                              <Award size={14} />
                              Uncategorized Skills
                            </h4>
                            <div className="flex flex-wrap gap-2.5 pt-1">
                              {uncategorized.map((item) => (
                                <div
                                  key={`admin-skill-uncat-${item.id}`}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm"
                                >
                                  <span className="font-semibold text-zinc-250">{item.name}</span>
                                  <div className="flex items-center border-l border-zinc-800 pl-2 ml-1 gap-1">
                                    <button
                                      onClick={() => startEditSkill(item)}
                                      className="text-zinc-500 hover:text-violet-400 transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSkill(item.id)}
                                      className="text-zinc-500 hover:text-rose-450 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
