/// <reference path="../../node_modules/typescript/lib/lib.d.ts" />

import { SessionService } from './session-service';
import { WlService } from './wl-service';
import { Promise } from 'es6-promise';

export class JoinWlService {

    private overlay: HTMLElement;

    private modal: HTMLElement;

    private iframe: HTMLIFrameElement;

    constructor (
        private wlService: WlService, 
        private sessionService: SessionService
    ) {
    }

    private onEscape (callback: () => void): () => void {
        function escapeListener (evt: KeyboardEvent): void {
            if (evt.key == 'Escape') {
                callback();
                evt.preventDefault();
            }
        }

        function removeEscapeListener (): void {
            window.removeEventListener('keydown', escapeListener, true);
        }

        window.addEventListener('keydown', escapeListener, true);
        
        return removeEscapeListener;
    }

    private showOverlay () {
        console.log('showing seaters overlay');
        this.overlay.style.display = 'block';
    }

    private hideOverlay () {
        console.log('hiding seaters overlay');
        this.overlay.style.display = 'none';
    }

    private setupOverlay () {
        if (this.overlay !== undefined) {
            return this.overlay;
        }
        
        this.overlay = document.createElement('div');
        this.overlay.id = 'seaters-overlay';
        this.overlay.style.position = 'fixed';
        this.overlay.style.left = '0px';
        this.overlay.style.right = '0px';
        this.overlay.style.top = '0px';
        this.overlay.style.bottom = '0px';
        this.overlay.style.backgroundColor = 'rgba(30, 30, 30, 0.3)';
        this.overlay.style.display = 'none';

        this.onEscape(() => this.hideOverlay());

        document.getElementsByTagName('body')[0].appendChild(this.overlay);
        return this.overlay;
    }
    

    private setupModal () {
        if (this.modal !== undefined) {
            return this.modal;
        }
        
        this.modal = document.createElement('div');
        this.modal.id = 'seaters-modal';
        this.modal.style.marginLeft = 'auto 50%';
        this.modal.style.marginRight = 'auto 50%';
        this.modal.style.minHeight = '300px';
        this.modal.style.backgroundColor = '#fff';
        this.modal.style.borderRadius = '5px';
        this.modal.style.boxShadow = '2px 2px 5px #888888';
        this.modal.style.width = '332px';
        this.modal.style.margin = '0px auto';
        this.modal.style.marginTop = '200px';
        this.modal.style.padding = '8px';
        
        this.overlay.appendChild(this.modal);
        return this.modal;
    }

    private setupIframe () {
        if (this.iframe) {
            return this.iframe;
        }
        
        this.iframe = document.createElement('iframe');
        this.iframe.id = 'seaters-iframe';
        this.iframe.src = '/components/join-wl-button';
        this.iframe.style.border = '0';
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        
        this.modal.appendChild(this.iframe);
        return this.iframe;
    }

    joinWl (wlId) {
        this.setupOverlay();
        this.setupModal();
        this.setupIframe();
        this.showOverlay();
        console.log('launching JoinWl popup for %s', wlId);
    }

}