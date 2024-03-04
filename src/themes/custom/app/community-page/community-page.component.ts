import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommunityPageComponent as BaseComponent } from '../../../../app/community-page/community-page.component';
import { fadeInOut } from '../../../../app/shared/animations/fade';
import {
  ComcolPageContentComponent
} from '../../../../app/shared/comcol/comcol-page-content/comcol-page-content.component';
import { ErrorComponent } from '../../../../app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ThemedComcolPageBrowseByComponent
} from '../../../../app/shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { DsoEditMenuComponent } from '../../../../app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  ThemedComcolPageHandleComponent
} from '../../../../app/shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageLogoComponent } from '../../../../app/shared/comcol/comcol-page-logo/comcol-page-logo.component';
import {
  ComcolPageHeaderComponent
} from '../../../../app/shared/comcol/comcol-page-header/comcol-page-header.component';
import { ViewTrackerComponent } from '../../../../app/statistics/angulartics/dspace/view-tracker.component';
import { VarDirective } from '../../../../app/shared/utils/var.directive';
import {
  ThemedCommunityPageSubCommunityListComponent
} from '../../../../app/community-page/sections/sub-com-col-section/sub-community-list/themed-community-page-sub-community-list.component';
import {
  ThemedCollectionPageSubCollectionListComponent
} from '../../../../app/community-page/sections/sub-com-col-section/sub-collection-list/themed-community-page-sub-collection-list.component';


@Component({
  selector: 'ds-community-page',
  // templateUrl: './community-page.component.html',
  templateUrl: '../../../../app/community-page/community-page.component.html',
  // styleUrls: ['./community-page.component.scss']
  styleUrls: ['../../../../app/community-page/community-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut],
  standalone: true,
  imports: [
    ComcolPageContentComponent,
    ErrorComponent,
    ThemedLoadingComponent,
    NgIf,
    TranslateModule,
    ThemedCommunityPageSubCommunityListComponent,
    ThemedCollectionPageSubCollectionListComponent,
    ThemedComcolPageBrowseByComponent,
    DsoEditMenuComponent,
    ThemedComcolPageHandleComponent,
    ComcolPageLogoComponent,
    ComcolPageHeaderComponent,
    AsyncPipe,
    ViewTrackerComponent,
    VarDirective
  ],
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent extends BaseComponent {}
