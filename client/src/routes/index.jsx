import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Public Layout & Pages
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import HistoryPage from '../pages/HistoryPage';
import BattalionsPage from '../pages/BattalionsPage';
import IntroductionPage from '../pages/IntroductionPage';
import NewsPage from '../pages/NewsPage';
import ActivitiesPage from '../pages/ActivitiesPage';
import GalleryPage from '../pages/GalleryPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin CMS Layout, Auth Guard & Pages
import ProtectedAdminRoute from './ProtectedAdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import IntroductionEditPage from '../pages/admin/introduction/IntroductionEditPage';

// History & Era Admin
import HistoryListPage from '../pages/admin/history/HistoryListPage';
import HistoryFormPage from '../pages/admin/history/HistoryFormPage';
import EraListPage from '../pages/admin/eras/EraListPage';

// Battalion Admin
import BattalionListPage from '../pages/admin/battalions/BattalionListPage';
import BattalionFormPage from '../pages/admin/battalions/BattalionFormPage';

// News Admin
import NewsListPage from '../pages/admin/news/NewsListPage';
import NewsFormPage from '../pages/admin/news/NewsFormPage';

// Activities Admin
import ActivityListPage from '../pages/admin/activities/ActivityListPage';
import ActivityFormPage from '../pages/admin/activities/ActivityFormPage';

// Gallery Admin
import GalleryListPage from '../pages/admin/gallery/GalleryListPage';
import GalleryFormPage from '../pages/admin/gallery/GalleryFormPage';

export const router = createBrowserRouter([
  // Public Portal Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'battalions',
        element: <BattalionsPage />,
      },
      {
        path: 'introduction',
        element: <IntroductionPage />,
      },
      {
        path: 'news',
        element: <NewsPage />,
      },
      {
        path: 'activities',
        element: <ActivitiesPage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },

  // Admin Login (Unguarded, redirects to /admin if already logged in)
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Protected Admin CMS Routes
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'introduction',
            element: <IntroductionEditPage />,
          },
          // History Management
          {
            path: 'history',
            element: <HistoryListPage />,
          },
          {
            path: 'history/create',
            element: <HistoryFormPage />,
          },
          {
            path: 'history/:id/edit',
            element: <HistoryFormPage />,
          },
          // Eras Management
          {
            path: 'eras',
            element: <EraListPage />,
          },
          // Battalions Management
          {
            path: 'battalions',
            element: <BattalionListPage />,
          },
          {
            path: 'battalions/create',
            element: <BattalionFormPage />,
          },
          {
            path: 'battalions/:id/edit',
            element: <BattalionFormPage />,
          },
          // News Management
          {
            path: 'news',
            element: <NewsListPage />,
          },
          {
            path: 'news/create',
            element: <NewsFormPage />,
          },
          {
            path: 'news/:id/edit',
            element: <NewsFormPage />,
          },
          // Activities Management
          {
            path: 'activities',
            element: <ActivityListPage />,
          },
          {
            path: 'activities/create',
            element: <ActivityFormPage />,
          },
          {
            path: 'activities/:id/edit',
            element: <ActivityFormPage />,
          },
          // Gallery Management
          {
            path: 'gallery',
            element: <GalleryListPage />,
          },
          {
            path: 'gallery/create',
            element: <GalleryFormPage />,
          },
          {
            path: 'gallery/:id/edit',
            element: <GalleryFormPage />,
          },
          // System & Footer Settings Management
          {
            path: 'settings',
            element: <AdminSettingsPage />,
          },
        ],
      },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
});

export default router;
