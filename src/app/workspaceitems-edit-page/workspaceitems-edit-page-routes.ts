import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ThemedFullItemPageComponent } from '../item-page/full/themed-full-item-page.component';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';
import { itemFromWorkspaceResolver } from './item-from-workspace.resolver';
import { workspaceItemPageResolver } from './workspace-item-page.resolver';
import { ThemedWorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page/themed-workspaceitems-delete-page.component';
import { WorkspaceItemsDeletePageComponent } from './workspaceitems-delete-page/workspaceitems-delete-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/home', pathMatch: 'full',
  },
  {
    path: ':id',
    resolve: { wsi: workspaceItemPageResolver },
    children: [
      {
        canActivate: [AuthenticatedGuard],
        path: 'edit',
        component: ThemedSubmissionEditComponent,
        resolve: {
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'submission.edit.title', breadcrumbKey: 'submission.edit' },
      },
      {
        canActivate: [AuthenticatedGuard],
        path: 'view',
        component: ThemedFullItemPageComponent,
        resolve: {
          dso: itemFromWorkspaceResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workspace-item.view.title', breadcrumbKey: 'workspace-item.view' },
      },
      {
        canActivate: [AuthenticatedGuard],
        path: 'delete',
        component: WorkspaceItemsDeletePageComponent,
        resolve: {
          dso: itemFromWorkspaceResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workspace-item.delete', breadcrumbKey: 'workspace-item.delete' },
      },
      {
        canActivate: [AuthenticatedGuard],
        path: 'delete',
        component: ThemedWorkspaceItemsDeletePageComponent,
        resolve: {
          dso: itemFromWorkspaceResolver,
          breadcrumb: i18nBreadcrumbResolver,
        },
        data: { title: 'workspace-item.delete', breadcrumbKey: 'workspace-item.delete' },
      },
    ],
  },
];
