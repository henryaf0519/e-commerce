import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent {
  @Input() phone: string = '19167506488'; 
  @Input() message: string = 'Hola, estoy interesado en los dulces de Dulcilandia.';
  
  showTooltip: boolean = false;

  get whatsappLink(): string {
    const encodedMessage = encodeURIComponent(this.message);
    return `https://wa.me/${this.phone}?text=${encodedMessage}`;
  }

}
