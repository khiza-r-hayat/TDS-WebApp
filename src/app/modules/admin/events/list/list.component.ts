import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { DatePipe, NgClass, PercentPipe } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { BehaviorSubject, combineLatest, Subject } from "rxjs";
import { EventModel } from "app/shared/core/domain/models/event.model";
import { EventService } from "app/shared/core/domain/services/event.service";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import { EventStatusType } from "app/shared/core/classes/utility";

@Component({
  selector: "app-list",
  standalone: true,
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkScrollable,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    NgClass,
    MatTooltipModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    PercentPipe,
    ReactiveFormsModule,
    TranslocoModule,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent implements OnInit, OnDestroy {
  availableStaus = [
    { id: 1, title: EventStatusType.ACTIVE_EVENTS },
    { id: 2, title: EventStatusType.ENDED_EVENTS },
    { id: 3, title: EventStatusType.UPCOMING_EVENTS },
  ];
  events: EventModel[];
  filteredEvents: EventModel[];
  filters: {
    statusSlug$: BehaviorSubject<string>;
    query$: BehaviorSubject<string>;
    hideCompleted$: BehaviorSubject<boolean>;
  } = {
    statusSlug$: new BehaviorSubject("all"),
    query$: new BehaviorSubject(""),
    hideCompleted$: new BehaviorSubject(false),
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _service: EventService
  ) {}

  /**
   * On init
   */
  ngOnInit(): void {
    // load events
    this.loadEvents();

    this.filterEventsBehavior();
  }

  /**
   * getting event list from service
   *
   * @param change
   */
  loadEvents(): void {
    const eventsList = this._service.events();
    if (eventsList) {
      this.events = this.filteredEvents = eventsList;
    }
  }

  filterEventsBehavior() {
    // Filter the events
    combineLatest([
      this.filters.statusSlug$,
      this.filters.query$,
      this.filters.hideCompleted$,
    ]).subscribe(([statusSlug, query, hideCompleted]) => {
      // Reset the filtered events
      this.filteredEvents = this.events;

      // Filter by status
      switch (statusSlug) {
        case "all":
          // Show all events
          this.filteredEvents = this.filteredEvents;
          break;

        case "Active Events":
          // Show only active events (events that are currently ongoing)
          const today = new Date();
          this.filteredEvents = this.filteredEvents.filter(
            (event) =>
              new Date(event.startDate) <= today &&
              today <= new Date(event.endDate)
          );
          break;

        case "Ended Events":
          // Show only events that have ended
          this.filteredEvents = this.filteredEvents.filter(
            (event) => new Date(event.endDate) < new Date()
          );
          break;

        case "Upcoming Events":
          // Show only upcoming events
          const upcomingDate = new Date();
          this.filteredEvents = this.filteredEvents.filter(
            (event) => new Date(event.startDate) > upcomingDate
          );
          break;

        default:
          break;
      }

      // Filter by search query
      if (query !== "") {
        this.filteredEvents = this.filteredEvents.filter((event) =>
          event.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Filter by completed
      if (hideCompleted) {
        // Show only events that have ended
        this.filteredEvents = this.filteredEvents.filter(
          (event) => new Date(event.endDate) < new Date()
        );
      }
    });
  }

  /**
   * Filter by status
   *
   * @param change
   */
  filterByStatus(change: MatSelectChange): void {
    this.filters.statusSlug$.next(change.value);
  }

  /**
   * Filter by search query
   *
   * @param query
   */
  filterByQuery(query: string): void {
    this.filters.query$.next(query);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  /**
   * Show/hide completed courses
   *
   * @param change
   */
  toggleCompleted(change: MatSlideToggleChange): void {
    this.filters.hideCompleted$.next(change.checked);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
