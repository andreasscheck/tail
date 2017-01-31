import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../../model/environment';
import { BackendService } from '../../services/backend.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent {
  @Input() env: Environment;
  private collapsed: boolean = true;
  private uploader: FileUploader = new FileUploader({
    'url': 'http://10.1.3.177:16060/upload'
  });
  constructor(private _backend: BackendService) {
    this.uploader.options.filters = [(({
      name: 'warfile', fn: function(item: any) {
        if (item && item.name.match('\.war$|\.ear$')) {
          return true;
        } else {
          return false;
        }
      }
    }))];
    this.uploader.options.autoUpload = true;

    this.uploader.onAfterAddingFile = (fileItem: any) => this.upload(fileItem, this.env);
  }

  upload(fileItem: any, env: Environment) {
    fileItem.withCredentials = false;
    fileItem.formData.push({ 'target-env': this.env.key });

    if (env.confirmDeploy === true) {
      let res = confirm('Wollen Sie das deployment wirklich auf gewählter Umgebung durchführen?');
      if (res === false) {
        fileItem.remove();
        fileItem.cancel();
      }
    }
  }

  startServer(env: Environment) {
    this._backend.startServer(env);
  }

  stopServer(env: Environment) {
    this._backend.stopServer(env);
  }

  startTail(env: Environment) {
    this._backend.startTail(env);
  }

  stopTail(env: Environment) {
    this._backend.stopTail(env);
  }
  openTerminal(env: Environment) {
    this._backend.openTerminal(env);
  }
}
