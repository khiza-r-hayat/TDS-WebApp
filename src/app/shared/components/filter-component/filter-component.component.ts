import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Utility } from "app/shared/core/classes/utility";
import { FilterModel } from "app/shared/core/domain/models/common.model";
import {
  CityModel,
  StockTypeModel,
} from "app/shared/core/domain/models/event.model";

@Component({
  selector: "app-filter-component",
  standalone: true,
  imports: [
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: "./filter-component.component.html",
})
export class FilterComponent {
  @Input() stockTypes = signal<StockTypeModel[]>([]);
  @Input() cities = signal<CityModel[]>([]);
  @Input() initFilter = signal<FilterModel>(null);
  @Output() filter = new EventEmitter<FilterModel>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
    this.filterForm = this.fb.group({
      startDate: [firstDay],
      endDate: [lastDay],
      selectedOption: [],
      stockType: [""],
    });
  }

  initStocktype = computed(() => {
    if (this.initFilter()) {
      return this.initFilter().stockType;
    }
  });

  initLocation = computed(() => {
    if (this.initFilter()) {
      return this.initFilter().selections;
    }
  });

  onFilter(): void {
    const form = this.filterForm.getRawValue();

    const selectedOption = form.selectedOption;

    this.filter.emit({
      startDate: Utility.formatDate(form.startDate),
      endDate: Utility.formatDate(form.endDate),
      selections: selectedOption,
      stockType: form.stockType,
    });
  }
}
