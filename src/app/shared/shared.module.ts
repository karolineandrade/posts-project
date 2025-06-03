import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TuiTable, TuiTablePagination } from '@taiga-ui/addon-table';
import { TuiDropdown, TuiHint, TuiAutoColorPipe, TuiButton, TuiIcon, TuiPopup, TuiBreakpointService } from '@taiga-ui/core';
import { TuiTooltip, TuiAvatar, TuiPagination, TuiButtonSelect, TuiDataListWrapper, TuiSkeleton, TuiDrawer } from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    TuiTablePagination,
    TuiAutoColorPipe,
    TuiPopup,
    TuiSkeleton,
    TuiDrawer,
    TuiHeader,
    TuiPagination,
    TuiButtonSelect,
    TuiTooltip,
    TuiAvatar,
    TuiButton,
    ...TuiTable,
    ...TuiDataListWrapper,
    ...TuiHint,
    ...TuiDropdown,
  ],
  exports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    TuiTablePagination,
    TuiAutoColorPipe,
    TuiPopup,
    TuiSkeleton,
    TuiDrawer,
    TuiHeader,
    TuiPagination,
    TuiButtonSelect,
    TuiTooltip,
    TuiAvatar,
    TuiButton,
    ...TuiTable,
    ...TuiDataListWrapper,
    ...TuiHint,
    ...TuiDropdown,
  ],
})
export class SharedModule {}
