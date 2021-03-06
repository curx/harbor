import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject';

import { MessageService } from '../../global-message/message.service';
import { AlertType, httpStatusCode } from '../../shared/shared.const';
import { errorHandler } from '../../shared/shared.utils';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../../shared/session.service';

@Injectable()
export class MessageHandlerService {

    constructor(
        private msgService: MessageService,
        private translate: TranslateService,
        private session: SessionService) { }

    //Handle the error and map it to the suitable message
    //base on the status code of error.

    public handleError(error: any | string): void {
        if (!error) {
            return;
        }
        let msg = errorHandler(error);

        if (!(error.statusCode || error.status)) {
            this.msgService.announceMessage(500, msg, AlertType.DANGER);
        } else {
            let code = error.statusCode | error.status;
            if (code === httpStatusCode.Unauthorized) {
                this.msgService.announceAppLevelMessage(code, msg, AlertType.DANGER);
                //Session is invalida now, clare session cache
                this.session.clear();
            } else {
                this.msgService.announceMessage(code, msg, AlertType.DANGER);
            }
        }
    }

    public showError(message: string, params: any): void {
        if (!params) {
            params = {};
        }
        this.translate.get(message, params).subscribe((res: string) => {
            this.msgService.announceMessage(500, res, AlertType.DANGER);
        });
    }

    public showSuccess(message: string): void {
        if (message && message.trim() != "") {
            this.msgService.announceMessage(200, message, AlertType.SUCCESS);
        }
    }

    public showInfo(message: string): void {
        if (message && message.trim() != "") {
            this.msgService.announceMessage(200, message, AlertType.INFO);
        }
    }

    public showWarning(message: string): void {
        if (message && message.trim() != "") {
            this.msgService.announceMessage(400, message, AlertType.WARNING);
        }
    }

    public clear(): void {
        this.msgService.clear();
    }

    public isAppLevel(error): boolean {
        return error && error.statusCode === httpStatusCode.Unauthorized;
    }
}