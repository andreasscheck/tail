import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../../model/environment';
import { BackendService } from '../../services/backend.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { SettingsService } from '../../services/settings.service';
import { Job } from '../../model/job';
@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css']
})
export class EnvironmentComponent {
  @Input() env: Environment;
  public collapsed: boolean = true;
  public settings: any;
  public uploader: FileUploader = new FileUploader({
    'url': 'http://10.1.3.177:16060/upload'
  });
  constructor(private _backend: BackendService, private settingsService: SettingsService) {
    this.settingsService.subscribeSettings().subscribe((settings: any) => {
      if (settings) {
        this.settings = settings;
        this.uploader = new FileUploader({
          'url': 'http://' + settings.host + ':' + settings.port + '/upload'
        });
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
    });

  }

  upload(fileItem: any, env: Environment) {
    let job = new Job(this.settings.username, 'deploy', this.env.key),
      userset = typeof this.settings !== 'undefined' && typeof this.settings.username !== 'undefined' && this.settings.username.length > 0;
    console.log(typeof this.settings, typeof this.settings.username);
    fileItem.withCredentials = false;
    fileItem.formData.push({ 'job': JSON.stringify(job)});
    if (! userset) {
      alert('Sie müssen in den Einstellungen einen User definert haben');
      fileItem.remove();
    } else if (env.confirmDeploy === true) {
      let res = confirm('Wollen Sie das deployment wirklich auf gewählter Umgebung durchführen?');
      if (res === false) {
        fileItem.remove();
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
