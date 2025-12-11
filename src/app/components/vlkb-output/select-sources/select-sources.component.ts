import { Component, input, InputSignal, OnInit } from '@angular/core';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel, IonRange, IonRow
} from "@ionic/angular/standalone";
import {AsyncPipe, NgClass} from "@angular/common";
import {addIcons} from "ionicons";
import {layersOutline, optionsOutline} from "ionicons/icons";
import {SourcesService} from "@services/sources/sources.service";
import {Observable} from "rxjs";
import {FourthLevelInterface, SourcePayloadInterface} from "@interfaces/source-interface";
import {VtkWsLinkService} from "@services/vtk-ws-link/vtk-ws-link.service";
import {ActivatedRoute} from "@angular/router";

type SelectSourceRowLineRadioValue = 'line' | 'curve';

type SelectSourceRowValues = {
  selectedId: string;
  isLayerToggled: boolean;
  dropdownValue: string;
  lineRadioValue: SelectSourceRowLineRadioValue;
  sliderValue?: number;
}

@Component({
    selector: 'app-select-sources',
    templateUrl: './select-sources.component.html',
    styleUrls: ['./select-sources.component.scss'],
  imports: [
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonCol,
    IonGrid,
    IonIcon,
    IonItem,
    IonLabel,
    IonRange,
    IonRow,
    NgClass,
    AsyncPipe
  ]
})
export class SelectSourcesComponent  implements OnInit {
  private selectSourceRowsValues: SelectSourceRowValues[] = []
  private prevSelectSourceRows: FourthLevelInterface[] = [];
  public selectSourceRows: Observable<FourthLevelInterface[]>;
  public payload: InputSignal<{}> = input({});

  constructor(
    private sourcesService: SourcesService,
    private vtkWsLinkService: VtkWsLinkService,
  ) {
    addIcons({layersOutline, optionsOutline})

    this.selectSourceRows = this.sourcesService.selected$.asObservable();
    this.selectSourceRows.subscribe((value) => {
      // Add values to selectSourceRowsValues for each added selectedSourceRows element
      for(const element of value) {
        if(!this.selectSourceRowsValues.find((value2) => value2.selectedId === element.id)) {
          this.selectSourceRowsValues.push({
            selectedId: element.id,
            isLayerToggled: true,
            dropdownValue: "Select a value",
            lineRadioValue: "line",
            sliderValue: 100
          });
        }
      }

      // Remove values from selectSourceRowsValues for each removed selectedSourceRows element
      for(const element of this.prevSelectSourceRows) {
        if(!value.includes(element)) {
          const toDelete = this.selectSourceRowsValues.find(
            (value2) => value2.selectedId === element.id
          );

          if(toDelete) {
            const toDeleteIndex = this.selectSourceRowsValues.indexOf(toDelete);

            this.selectSourceRowsValues.splice(toDeleteIndex, 1);
          }
        }
      }

      // Update the previous selectedSourceRows values
      this.prevSelectSourceRows = value;
    });
  }

  ngOnInit() {
  }

  isLayerToggled(rowIndex: number) {
    return this.selectSourceRowsValues[rowIndex].isLayerToggled;
  }

  toggleLayer(rowIndex: number) {
    this.selectSourceRowsValues[rowIndex].isLayerToggled = !this.selectSourceRowsValues[rowIndex].isLayerToggled;
  }

  getDropdownValue(rowIndex: number) {
    return this.selectSourceRowsValues[rowIndex].dropdownValue;
  }

  isLineRadioActive(value: SelectSourceRowLineRadioValue, rowIndex: number) {
    return this.selectSourceRowsValues[rowIndex].lineRadioValue === value;
  }

  setLineRadioValue(value: SelectSourceRowLineRadioValue, rowIndex: number) {
    this.selectSourceRowsValues[rowIndex].lineRadioValue = value;
  }

  sliderHandler(event: any, rowIndex: number) {
    event.preventDefault();
    event.stopPropagation();

    this.selectSourceRowsValues[rowIndex].sliderValue = event.target.value as number | undefined;
  }

  getSliderValue(rowIndex: number) {
    return this.selectSourceRowsValues[rowIndex].sliderValue;
  }

  openOptions(rowIndex: number) {
    console.log('TODO Settings for the', rowIndex, 'element of selectSourcesRows');
  }

  downloadFits(row: FourthLevelInterface) {
    console.warn('downloadFits', this.payload());
    this.vtkWsLinkService.call('vlkb.cutout', {_data: {
      id: row.id,
        ...this.payload()
    }}).then((response) => console.log(response));
  }
}
