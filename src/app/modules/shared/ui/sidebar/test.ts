const roles = {
  admin: {
    id: 1,
    name: 'Admin',
    permissions: [
      { id: 1, name: 'create_post' },
      { id: 2, name: 'edit_post' },
      { id: 3, name: 'delete_post' },
      { id: 4, name: 'manage_users' },
      { id: 5, name: 'view_analytics' },
    ],
  },
  user: {
    id: 2,
    name: 'User',
    permissions: [
      { id: 1, name: 'create_post' },
      { id: 6, name: 'edit_own_post' },
      { id: 7, name: 'view_own_post' },
      { id: 8, name: 'view_public_posts' },
    ],
  },
};

const userPermissions = {
  admin: [
    'create_post',
    'edit_post',
    'delete_post',
    'manage_users',
    'view_analytics',
  ],
  user: ['create_post', 'edit_own_post', 'view_own_post', 'view_public_posts'],
};
