/**
 * This is a continuation of ngx-popover
 * @Reference {github} https://github.com/pleerock/ngx-popover
 */

import {
    ChangeDetectorRef,
    ComponentRef,
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    Output,
    SimpleChange,
    ViewContainerRef,
    ApplicationRef,
    Injector,
    Type,
    EmbeddedViewRef,
    EnvironmentInjector,
    createComponent
} from '@angular/core';
import { PopoverContentComponent } from './popover-content.component';
import { PopoverPlacement } from './popover.placement';


/**
* @group Basic Toolkit
* @component Popover Directive
*/
@Directive({
    selector: '[popover]',
    exportAs: 'popover'
})
export class PopoverDirective implements OnChanges {
    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------
    protected popoverContentComponent = PopoverContentComponent;
    protected popover: ComponentRef<PopoverContentComponent>;
    protected visible: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected cdr: ChangeDetectorRef,
        protected appRef: ApplicationRef,
        private injector: EnvironmentInjector
    ) { }

    // -------------------------------------------------------------------------
    // Inputs / Outputs
    // -------------------------------------------------------------------------
    @Input('popover') public content: string | PopoverContentComponent;
    @Input() public popoverSize: 'small' | 'medium-small' | 'medium' | 'large' | 'auto';
    @Input() public popoverDisabled: boolean;
    @Input() public popoverAnimation: boolean;
    @Input() public popoverPlacement: PopoverPlacement;
    @Input() public popoverTitle: string;
    @Input() public popoverOnHover = true;
    @Input() public popoverCloseOnClickOutside: boolean;
    @Input() public popoverCloseOnMouseOutside: boolean;
    @Input() public popoverDismissTimeout = 0;
    @Input() public appendToBody: boolean;
    @Output() public onShown = new EventEmitter<PopoverDirective>();
    @Output() public onHidden = new EventEmitter<PopoverDirective>();

    // -------------------------------------------------------------------------
    // Event listeners
    // -------------------------------------------------------------------------
    @HostListener('click', ['$event'])
    public showOrHideOnClick(evt: Event): void {
        if (this.popoverOnHover) {
            return;
        }
        if (this.popoverDisabled) {
            return;
        }
        evt.stopImmediatePropagation();
        this.toggle();
    }

    @HostListener('touchend', ['$event'])
    public showOrHideOnTouch(evt: Event): void {
        evt.stopImmediatePropagation();
        if (!this.popoverOnHover) {
            return;
        }
        if (this.popoverDisabled) {
            return;
        }
        this.toggle();
    }

    @HostListener('focusin')
    @HostListener('mouseenter')
    public showOnHover(): void {
        if (!this.popoverOnHover) {
            return;
        }
        if (this.popoverDisabled) {
            return;
        }
        this.show();
    }

    @HostListener('focusout')
    @HostListener('mouseleave')
    public hideOnHover(): void {
        if (this.popoverCloseOnMouseOutside) {
            return; // don't do anything since we do not control this
        }
        if (!this.popoverOnHover) {
            return;
        }
        if (this.popoverDisabled) {
            return;
        }
        this.hide();
    }

    public ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
        if (changes['popoverDisabled']) {
            if (changes['popoverDisabled'].currentValue) {
                this.hide();
            }
        }
    }

    protected createComponent(component: Type<any>): ComponentRef<any> {
        

        // Create a component reference from the component
        const componentRef = createComponent(component, {
            environmentInjector: this.injector,
        });

        if (this.appendToBody) {
            this.appRef.attachView(componentRef.hostView);
            const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);
        }

        return componentRef;
    }

    protected removeComponent(componentRef: ComponentRef<any>) {
        if (this.popover) {
            if (this.appendToBody) {
                this.appRef.detachView(componentRef.hostView);
            }
            componentRef.destroy();
        }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    public toggle(): void {
        if (!this.visible) {
            this.show();
        } else {
            this.hide();
        }
    }

    public show(): void {
        if (this.visible) {
            return;
        }

        this.visible = true;
        if (typeof this.content === 'string') {
            if (!this.visible) {
                return;
            }

            this.popover = this.createComponent(this.popoverContentComponent);
            const popover = this.popover.instance as PopoverContentComponent;
            popover.popover = this;
            popover.content = this.content as string;
            if (this.popoverPlacement !== undefined) {
                popover.placement = this.popoverPlacement;
            }
            if (this.popoverAnimation !== undefined) {
                popover.animation = this.popoverAnimation;
            }
            if (this.popoverTitle !== undefined) {
                popover.title = this.popoverTitle;
            }
            if (this.popoverCloseOnClickOutside !== undefined) {
                popover.closeOnClickOutside = this.popoverCloseOnClickOutside;
            }
            if (this.popoverCloseOnMouseOutside !== undefined) {
                popover.closeOnMouseOutside = this.popoverCloseOnMouseOutside;
            }
            if (this.popoverSize) {
                popover.size = this.popoverSize;
            }

            popover.appendToBody = this.appendToBody;

            popover.onCloseFromOutside.subscribe(() => this.hide());
            // if dismissTimeout option is set, then this popover will be dismissed in dismissTimeout time
            if (this.popoverDismissTimeout > 0) {
                setTimeout(() => this.hide(), this.popoverDismissTimeout);
            }
        } else {
            const popover = this.content as PopoverContentComponent;
            popover.popover = this;
            if (this.popoverPlacement !== undefined) {
                popover.placement = this.popoverPlacement;
            }
            if (this.popoverAnimation !== undefined) {
                popover.animation = this.popoverAnimation;
            }
            if (this.popoverTitle !== undefined) {
                popover.title = this.popoverTitle;
            }
            if (this.popoverCloseOnClickOutside !== undefined) {
                popover.closeOnClickOutside = this.popoverCloseOnClickOutside;
            }
            if (this.popoverCloseOnMouseOutside !== undefined) {
                popover.closeOnMouseOutside = this.popoverCloseOnMouseOutside;
            }
            if (this.popoverSize) {
                popover.size = this.popoverSize;
            }

            popover.appendToBody = this.appendToBody;

            popover.onCloseFromOutside.subscribe(() => this.hide());
            // if dismissTimeout option is set, then this popover will be dismissed in dismissTimeout time
            if (this.popoverDismissTimeout > 0) {
                setTimeout(() => this.hide(), this.popoverDismissTimeout);
            }
            popover.show();
        }

        this.cdr.detectChanges();
        this.onShown.emit(this);
    }

    public hide(): void {
        if (!this.visible) {
            return;
        }

        this.visible = false;
        this.removeComponent(this.popover);

        if (this.content instanceof PopoverContentComponent) {
            (this.content as PopoverContentComponent).hideFromPopover();
        }

        this.cdr.detectChanges();
        this.onHidden.emit(this);
    }

    public getElement(): HTMLElement {
        return this.viewContainerRef.element.nativeElement;
    }
}
