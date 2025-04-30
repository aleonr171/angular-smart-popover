import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PopoverContentComponent, PopoverDirective } from 'projects/ngx-smart-popover/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PopoverContentComponent, PopoverDirective]
})
export class AppComponent {
    title = 'ngx-smart-popover-demo';
}
