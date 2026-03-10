import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  readonly currentYear = new Date().getFullYear();

  readonly features: Feature[] = [
    {
      icon: 'pi-file-pdf',
      title: 'Comprobantes de nómina',
      description: 'Consulta y descarga tus comprobantes de pago en cualquier momento.',
    },
    {
      icon: 'pi-verified',
      title: 'Certificaciones laborales',
      description: 'Genera y solicita certificados de trabajo de forma inmediata.',
    },
    {
      icon: 'pi-calendar-plus',
      title: 'Solicitud de vacaciones',
      description: 'Gestiona y haz seguimiento a tus solicitudes de días libres.',
    },
    {
      icon: 'pi-calendar',
      title: 'Programación',
      description: 'Revisa tu programación de turnos y horarios asignados.',
    },
    {
      icon: 'pi-heart',
      title: 'Seguridad social',
      description: 'Consulta aportes a salud, pensión y ARL al día.',
    },
    {
      icon: 'pi-graduation-cap',
      title: 'Capacitaciones',
      description: 'Accede a cursos y registra tu progreso de formación.',
    },
    {
      icon: 'pi-clock',
      title: 'Puesto y turno asignado',
      description: 'Conoce tu puesto de trabajo y el turno vigente.',
    },
    {
      icon: 'pi-th-large',
      title: 'Y mucho más',
      description: 'Más módulos disponibles dentro del portal para tu comodidad.',
    },
  ];
}
