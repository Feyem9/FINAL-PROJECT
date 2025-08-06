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

  const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;

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

  const handleCreateOrEdit = async e => {
    e.preventDefault();
    setCreating(true);
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      if (form.image) formData.append('image', form.image);
      if (form.tags) formData.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim())));
      if (form.categories) formData.append('categories', JSON.stringify(form.categories.split(',').map(c => c.trim())));

      const token = localStorage.getItem('token');
      const url = editingBlogId
        ? `${API_URL}/blog/${editingBlogId}`
        : `${API_URL}/blog/create`;

      const method = editingBlogId ? 'put' : 'post';

      await axios({
        method,
        url,
        data: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'multipart/form-data'
        }
      });

      setForm({ title: '', content: '', image: null, tags: '', categories: '' });
      setEditingBlogId(null);
    } catch (err) {
      setFormError('Impossible de soumettre le blog');
    }

    setCreating(false);
    const handleEditClick = blog => {
      setForm({
        title: blog.title,
        content: blog.content,
        image: null,
        tags: blog.tags ? blog.tags.join(', ') : '',
        categories: blog.categories ? blog.categories.join(', ') : '',
      });
      setEditingBlogId(blog._id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <Box className="min-h-screen bg-gray-50 py-8 px-4 sm:px-8">
          <Box className="max-w-5xl mx-auto">
            <Typography variant="h4" component="h1" className="text-center mb-6 text-purple-700 font-bold">
              Blog de l'école & du monde musical
            </Typography>

            <Box className="bg-white border rounded-lg shadow-md p-6 mb-8">
              <Typography variant="h6" component="h2" className="text-purple-700 font-bold mb-2">
                {editingBlogId ? 'Modifier un article' : 'Créer un article'}
              </Typography>
              <form onSubmit={handleCreateOrEdit} encType="multipart/form-data">
                <Stack spacing={3}>
                  <TextField
                    label="Titre"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                  />
                  <TextField
                    label="Contenu"
                    name="content"
                    value={form.content}
                    onChange={handleFormChange}
                    multiline
                    rows={4}
                    required
                  />
                  <Button variant="contained" component="label">
                    Upload Image
                    <input type="file" name="image" hidden onChange={handleFormChange} />
                  </Button>
                  <TextField
                    label="Tags (séparés par des virgules)"
                    name="tags"
                    value={form.tags}
                    onChange={handleFormChange}
                  />
                  <TextField
                    label="Catégories (séparées par des virgules)"
                    name="categories"
                    value={form.categories}
                    onChange={handleFormChange}
                  />
                  {formError && <Alert severity="error">{formError}</Alert>}
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" type="submit" disabled={creating}>
                      {editingBlogId ? 'Modifier' : 'Créer'}
                    </Button>
                    {editingBlogId && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setForm({ title: '', content: '', image: null, tags: '', categories: '' });
                          setEditingBlogId(null);
                        }}
                      >
                        Annuler
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </form>
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={4} alignItems="center">
              <TextField
                label="Rechercher un article..."
                value={search}
                onChange={handleSearchChange}
                className="w-full md:w-1/3"
              />
              <TextField
                label="Filtrer par tag"
                value={tag}
                onChange={handleTagChange}
                className="w-full md:w-1/4"
              />
              <TextField
                label="Filtrer par catégorie"
                value={category}
                onChange={handleCategoryChange}
                className="w-full md:w-1/4"
              />
              <Typography className="text-gray-500 text-sm">{total} article(s)</Typography>
            </Stack>

            {loading ? (
              <Box className="flex justify-center items-center py-12">
                <CircularProgress color="secondary" />
                <Typography className="ml-4 text-purple-500 font-semibold">Chargement des articles...</Typography>
              </Box>
            ) : blogs.length === 0 ? (
              <Typography className="text-center text-gray-500 py-12">Aucun article trouvé.</Typography>
            ) : (
              <Grid container spacing={4}>
                {blogs.map(blog => (
                  <Grid item xs={12} md={6} key={blog._id}>
                    <Box
                      className="bg-white border rounded-lg shadow-md p-4 border-l-4 border-purple-400 hover:shadow-xl cursor-pointer"
                      onClick={() => openBlog(blog)}
                    >
                      {blog.image && (
                        <Box className="mb-2">
                          <img
                            src={`${API_URL}/${blog.image}`}
                            alt={blog.title}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        </Box>
                      )}
                      <Typography variant="h6" className="text-purple-700 font-semibold">{blog.title}</Typography>
                      <Stack direction="row" spacing={1} className="mt-1">
                        {blog.tags && blog.tags.map(tag => (
                          <Chip key={tag} label={tag} color="primary" size="small" />
                        ))}
                        {blog.categories && blog.categories.map(cat => (
                          <Chip key={cat} label={cat} color="secondary" size="small" />
                        ))}
                      </Stack>
                      <Typography className="text-gray-700">{blog.content.slice(0, 120)}...</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" className="mt-2">
                        <Typography className="text-xs text-gray-400">
                          {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Brouillon'}
                        </Typography>
                        {blog.author && (
                          <Typography className="text-xs text-gray-500">
                            Par {blog.author.name || 'Auteur'}
                          </Typography>
                        )}
                      </Stack>
                      <Button
                        size="small"
                        color="primary"
                        className="self-end"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditClick(blog);
                        }}
                      >
                        Modifier
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} className="mt-8">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </Button>
              <Typography className="text-gray-700 font-semibold">
                Page {page} / {Math.ceil(total / limit) || 1}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setPage(p => (p * limit < total ? p + 1 : p))}
                disabled={page * limit >= total}
              >
                Suivant
              </Button>
            </Stack>

            <Modal open={open && selectedBlog} onClose={closeBlog} className="flex justify-center items-center">
              <Box className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
                <Typography variant="h6" component="h2" className="mb-4">
                  {selectedBlog?.title}
                </Typography>
                {selectedBlog?.image && (
                  <Box className="mb-4">
                    <img
                      src={`${API_URL}/${selectedBlog.image}`}
                      alt={selectedBlog.title}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </Box>
                )}
                <Stack direction="row" spacing={1} className="mb-2">
                  {selectedBlog?.tags?.map(tag => (
                    <Chip key={tag} label={tag} color="primary" size="small" />
                  ))}
                  {selectedBlog?.categories?.map(cat => (
                    <Chip key={cat} label={cat} color="secondary" size="small" />
                  ))}
                </Stack>
                <Typography className="text-gray-700 mb-4 whitespace-pre-line">{selectedBlog?.content}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" className="mb-2">
                  <Typography className="text-xs text-gray-400">
                    {selectedBlog?.publishedAt ? new Date(selectedBlog.publishedAt).toLocaleDateString() : 'Brouillon'}
                  </Typography>
                  {selectedBlog?.author && (
                    <Typography className="text-xs text-gray-500">
                      Par {selectedBlog.author.name || 'Auteur'}
                    </Typography>
                  )}
                </Stack>
                <Box className="border-b border-gray-200 my-3" />
                <Box className="mt-4">
                  <Typography variant="subtitle1" className="font-semibold mb-2">Commentaires</Typography>
                  {selectedBlog?.comments && selectedBlog.comments.length > 0 ? (
                    <Stack spacing={2}>
                      {selectedBlog.comments.map((c, idx) => (
                        <Box key={idx} className="pb-2 border-b border-gray-200">
                          <Typography className="font-bold text-purple-700">{c.user?.name || 'Utilisateur'}</Typography>
                          <Typography className="text-gray-600">{c.comment}</Typography>
                          <Typography className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography className="text-gray-500 text-sm">Aucun commentaire.</Typography>
                  )}
                  <form onSubmit={handleCommentSubmit}>
                    <Stack spacing={2} className="mt-4">
                      <TextareaAutosize
                        placeholder="Ajouter un commentaire..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      />
                      {commentError && <Alert severity="error">{commentError}</Alert>}
                      <Button variant="contained" color="primary" type="submit" disabled={commentLoading} className="self-end">
                        Commenter
                      </Button>
                    </Stack>
                  </form>
                </Box>
              </Box>
            </Modal>
          </Box>
        </Box>
      </ThemeProvider>
    );
  };



}