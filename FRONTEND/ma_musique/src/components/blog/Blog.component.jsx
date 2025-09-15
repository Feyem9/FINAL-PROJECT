import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Chip,
  CircularProgress,
  Typography,
  Grid,
  Modal,
  TextareaAutosize,
  Alert,
  Pagination,
  Stack,
  TextField,
} from '@mui/material';
import { Navbar } from '../../home/Navbar';
import Footer from '../../home/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const theme = createTheme();

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    image: null,
    tags: '',
    categories: '',
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  // const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI || import.meta.env.VITE_TESTING_BACKEND_URI;

  // console.log("API URL:", API_URL);


  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/blog/all`, {
          params: {
            page,
            limit,
            search,
            ...(tag ? { tag } : {}),
            ...(category ? { category } : {}),
          },
        });

        const data = response.data;

        setBlogs(data.blogs || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des blogs :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL, page, limit, search, tag, category, creating, editingBlogId]);

  const handleSearchChange = e => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTagChange = e => {
    setTag(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = e => {
    setCategory(e.target.value);
    setPage(1);
  };

  const openBlog = blog => {
    setSelectedBlog(blog);
    setOpen(true);
  };

  const closeBlog = () => {
    setSelectedBlog(null);
    setOpen(false);
  };

  const handleFormChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  // const handleCreateOrEdit = async e => {
  //   e.preventDefault();
  //   setCreating(true);
  //   setFormError('');
  //   try {
  //     const formData = new FormData();

  //     formData.append('title', form.title);
  //     formData.append('content', form.content);
  //     if (form.image) formData.append('image', form.image);
  //     if (form.tags) formData.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim())));
  //     if (form.categories) formData.append('categories', JSON.stringify(form.categories.split(',').map(c => c.trim())));

  //     const token = localStorage.getItem('token');
  //     const url = editingBlogId
  //       ? `${API_URL}/blog/${editingBlogId}`
  //       : `${API_URL}/blog/create`;

  //     const method = editingBlogId ? 'put' : 'post';

  //     await axios({
  //       method,
  //       url,
  //       data: formData,
  //       headers: {
  //         ...(token && { Authorization: `Bearer ${token}` }),
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     console.log('Submitting blog with data:', formData);

  //     setForm({ title: '', content: '', image: null, tags: '', categories: '' });
  //     setEditingBlogId(null);
  //   } catch (err) {
  //     setFormError('Impossible de soumettre le blog');
  //   }

  //   setCreating(false);
  // };

  // const handleEditClick = blog => {
  //   setForm({
  //     title: blog.title,
  //     content: blog.content,
  //     image: null,
  //     tags: blog.tags ? blog.tags.join(', ') : '',
  //     categories: blog.categories ? blog.categories.join(', ') : '',
  //   });
  //   setEditingBlogId(blog._id);
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  const handleCreateOrEdit = async e => {
    e.preventDefault();
    console.log("🔵 Début de la soumission du formulaire...");

    setCreating(true);
    setFormError('');

    try {
      const formData = new FormData();

      console.log("📌 Données du formulaire avant envoi :", form);

      formData.append('title', form.title);
      formData.append('content', form.content);
      if (form.image) {
        console.log("🖼️ Image sélectionnée :", form.image.name);
        formData.append('image', form.image);
      }
      if (form.tags) {
        const tagsArray = form.tags.split(',').map(t => t.trim());
        console.log("🏷️ Tags :", tagsArray);
        formData.append('tags', JSON.stringify(tagsArray));
      }
      if (form.categories) {
        const categoriesArray = form.categories.split(',').map(c => c.trim());
        console.log("📂 Catégories :", categoriesArray);
        formData.append('categories', JSON.stringify(categoriesArray));
      }

      const token = localStorage.getItem('token');
      console.log("🔑 Token récupéré :", token ? "Oui" : "Non");

      const url = editingBlogId
        ? `${API_URL}/blog/${editingBlogId}`
        : `${API_URL}/blog/create`;

      const method = editingBlogId ? 'put' : 'post';

      console.log(`📡 Méthode HTTP : ${method.toUpperCase()} | URL : ${url}`);

      // Debug du contenu du FormData (pas directement lisible, donc on l'affiche clé par clé)
      for (let pair of formData.entries()) {
        console.log(`➡️ FormData[${pair[0]}] :`, pair[1]);
      }

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("✅ Réponse du serveur :", response.data);

      setForm({ title: '', content: '', image: null, tags: '', categories: '' });
      setEditingBlogId(null);

    } catch (err) {
      console.error("❌ Erreur lors de la soumission :", err.response ? err.response.data : err.message);
      setFormError('Impossible de soumettre le blog');
    }

    setCreating(false);
    console.log("🔴 Fin de la soumission du formulaire.");
  };

  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!comment.trim()) return;

    setCommentLoading(true);
    setCommentError('');

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${API_URL}/blog/${selectedBlog._id}/comment`,
        { comment },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      setSelectedBlog(res.data); // Axios met déjà le JSON dans `res.data`
      setComment('');
    } catch (err) {
      setCommentError('Impossible d\'ajouter le commentaire');
    }

    setCommentLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>

      <Navbar />
      <Box className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <Box className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <Typography variant="h4" component="h1" className="text-3xl font-bold text-gray-800 mb-2">
                School Blog
              </Typography>
              <p className="text-gray-600">Discover the latest news and insights from our music school</p>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">This Month</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {blogs.filter(blog => {
                      const blogDate = new Date(blog.publishedAt || blog.createdAt);
                      const now = new Date();
                      return blogDate.getMonth() === now.getMonth() &&
                        blogDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Categories</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {[...new Set(blogs.flatMap(blog => blog.categories || []))].length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <Box className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <Typography variant="h6" component="h2" className="text-xl font-bold text-gray-800 mb-6">
              {editingBlogId ? 'Edit Article' : 'Create New Article'}
            </Typography>
            <form onSubmit={handleCreateOrEdit} encType="multipart/form-data" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <TextField
                    id="title"
                    label="Article Title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <Button
                    variant="contained"
                    component="label"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  >
                    Upload Image
                    <input type="file" name="image" hidden onChange={handleFormChange} />
                  </Button>
                </div>
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <TextField
                  id="content"
                  label="Article Content"
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  multiline
                  rows={6}
                  required
                  fullWidth
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <TextField
                    id="tags"
                    label="Tags (comma separated)"
                    name="tags"
                    value={form.tags}
                    onChange={handleFormChange}
                    fullWidth
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <TextField
                    id="categories"
                    label="Categories (comma separated)"
                    name="categories"
                    value={form.categories}
                    onChange={handleFormChange}
                    fullWidth
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {editingBlogId && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setForm({ title: '', content: '', image: null, tags: '', categories: '' });
                      setEditingBlogId(null);
                    }}
                    className="px-5 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingBlogId ? 'Update Article' : 'Create Article'}
                </Button>
              </div>
            </form>
          </Box>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <TextField
                label="Search articles..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <TextField
                label="Filter by tag"
                value={tag}
                onChange={handleTagChange}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <TextField
                label="Filter by category"
                value={category}
                onChange={handleCategoryChange}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <Typography className="text-gray-600 font-medium">Loading articles...</Typography>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <Typography variant="h6" className="text-xl font-bold text-gray-800 mb-2">No articles found</Typography>
              <Typography className="text-gray-600 mb-6">There are currently no articles to display.</Typography>
            </div>
          ) : (
            <Grid container spacing={6}>
              {blogs.map(blog => (
                <Grid item xs={12} md={6} lg={4} key={blog._id}>
                  <Box
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => openBlog(blog)}
                  >
                    {blog.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`${API_URL}/${blog.image}`}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Typography variant="h6" className="font-bold text-gray-800 text-lg line-clamp-1">
                          {blog.title}
                        </Typography>
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          New
                        </span>
                      </div>
                      <Stack direction="row" spacing={1} className="mb-3">
                        {blog.tags && blog.tags.map(tag => (
                          <Chip key={tag} label={tag} size="small" className="bg-purple-100 text-purple-800" />
                        ))}
                        {blog.categories && blog.categories.map(cat => (
                          <Chip key={cat} label={cat} size="small" className="bg-blue-100 text-blue-800" />
                        ))}
                      </Stack>
                      <Typography className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.content.slice(0, 120)}...
                      </Typography>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                        </span>
                        {blog.author && (
                          <span>
                            By {blog.author.name || 'Author'}
                          </span>
                        )}
                      </div>
                      <Button
                        size="small"
                        color="primary"
                        className="self-end mt-4"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditClick(blog);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            <span className="text-gray-700 font-semibold px-4 py-2">
              Page {page} / {Math.ceil(total / limit) || 1}
            </span>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
              disabled={page * limit >= total}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors font-medium flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <Modal open={open && selectedBlog} onClose={closeBlog} className="flex justify-center items-center p-4">
            <Box className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h6" component="h2" className="text-2xl font-bold text-gray-800">
                  {selectedBlog?.title}
                </Typography>
                <button
                  onClick={closeBlog}
                  className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedBlog?.image && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img
                    src={`${API_URL}/${selectedBlog.image}`}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <Stack direction="row" spacing={1} className="mb-4">
                {selectedBlog?.tags?.map(tag => (
                  <Chip key={tag} label={tag} size="small" className="bg-purple-100 text-purple-800" />
                ))}
                {selectedBlog?.categories?.map(cat => (
                  <Chip key={cat} label={cat} size="small" className="bg-blue-100 text-blue-800" />
                ))}
              </Stack>
              <Typography className="text-gray-700 mb-6 whitespace-pre-line">{selectedBlog?.content}</Typography>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                <span>
                  {selectedBlog?.publishedAt ? new Date(selectedBlog.publishedAt).toLocaleDateString() : 'Draft'}
                </span>
                {selectedBlog?.author && (
                  <span>
                    By {selectedBlog.author.name || 'Author'}
                  </span>
                )}
              </div>
              <div className="border-b border-gray-200 my-6"></div>
              <div className="mt-6">
                <Typography variant="subtitle1" className="font-bold text-gray-800 mb-4">Comments</Typography>
                {selectedBlog?.comments && selectedBlog.comments.length > 0 ? (
                  <Stack spacing={4}>
                    {selectedBlog.comments.map((c, idx) => (
                      <div key={idx} className="pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <Typography className="font-bold text-purple-700">{c.user?.name || 'User'}</Typography>
                          <Typography className="text-xs text-gray-400">
                            {new Date(c.createdAt).toLocaleString()}
                          </Typography>
                        </div>
                        <Typography className="text-gray-600">{c.comment}</Typography>
                      </div>
                    ))}
                  </Stack>
                ) : (
                  <Typography className="text-gray-500 text-sm mb-6">No comments yet.</Typography>
                )}
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Add a comment
                    </label>
                    <TextareaAutosize
                      id="comment"
                      placeholder="Write your comment..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                      rows={3}
                    />
                  </div>
                  {commentError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {commentError}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={commentLoading}
                      className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentLoading ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              </div>
            </Box>
          </Modal>
        </Box>
      </Box>
      <Footer />
    </ThemeProvider>
  );
};
