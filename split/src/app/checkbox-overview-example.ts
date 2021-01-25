import {
  Component,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ElementRef,
  OnChanges,
  OnInit,
  Renderer2,
  ViewChild,
  Input
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { HttpClient } from "@angular/common/http";
import {
  FormGroup,
  FormBuilder
} from "@angular/forms";


declare var $: any;
@Component({
  selector: "checkbox-overview-example",
  templateUrl: "checkbox-overview-example.html",
  styleUrls: ["checkbox-overview-example.css"]
})
export class CheckboxOverviewExample implements OnInit {
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChild('button') button: ElementRef;
  public analytics: any;
  public criterias: any;
  public dataStreams: any;
  public operatorsList: any;
  public uiContent: any;
  public criteriaOptions: any;
  public splitMapForm: FormGroup;
  public panelOpenState = false;
  public operatorsArray: any = [];
  public status: boolean = false;
  public stateCriteria = true;
  public masterSelected: any;
  public isExpanded: boolean = true;
  public mapSplitCounts: any
  public mapWindowSplitCount: any;
  public showAccordionCount: any;
  public checkedList: any;
  public indexValue: any;
  public operatorError: boolean = false;
  public updatedArray: [] = [];
  public selectedButtonToggle: any;
  public criteriaNamesArray: any = [];
  public criteriaOptionsArray: any = [];
  public criteriasPayload: any = [];
  public finalPayload: any = [];
  public radioButtonStatus: boolean = true;
  public gridData: any = [];

  @Input() expanded: any = false;
  constructor(private http: HttpClient, private renderer: Renderer2, private elem: ElementRef) {
    this.http.get("assets/config.json").subscribe(data => {
      this.uiContent = data;
      this.criterias = this.uiContent[0].criterias;
      this.criteriaOptions = this.uiContent[0].criterias;
      this.dataStreams = this.uiContent[0].data[0].dataStreams;
      this.operatorsList = this.uiContent[0].operators[0].operatorsList;
    });
  }
  ngOnInit() {
  }

  datastreamSlideToggle(event: any) {

    if (event.checked) {
      this.lsrJioDataCall();
    } else {
      this.myJioDataCall();
    }
  }

  myJioDataCall() {
    let myJioJSON = [
      {
        name: "My JIo"
      }
    ]
    return myJioJSON;
  }
  lsrJioDataCall() {
    let lsrJioJSON = [
      {
        name: "My JIo"
      }
    ]
    return lsrJioJSON;
  }

  operatorSelected(operator: any, index: any, buttonselected: any) {
    this.checkButtonToggleState(buttonselected);
    if (this.operatorsArray.indexOf(operator.name) == -1) {
      this.operatorsArray.push(operator.name);
    }
    else {
      let indexv = this.operatorsArray.indexOf(operator.name);
      this.operatorsArray.splice(indexv, 1);
    }
    this.toggleAllAccordions(this.operatorsArray);
  }
  checkButtonToggleState(buttonselected: any) {
    let containsClass = $(buttonselected.source._elementRef.nativeElement).hasClass("mat-button-toggle-checked")
    if (containsClass) {
      $(buttonselected.source._elementRef.nativeElement).removeClass("myclass")
    }
    else {
      $(buttonselected.source._elementRef.nativeElement).addClass("myclass")
    }
    let d = document.querySelectorAll(".myclass");
    d.forEach((element: any) => {
      console.log($(element).hasClass("myclass"));
      if ($(element).hasClass("myclass")) {
        this.resetForm();
      }
    });
  }
  toggleAllAccordions(operatorsArray: any) {
    this.criterias.forEach((element: any) => {
      if (operatorsArray.length > 0) {
        element.disabled = false;
        element.accordionState = false;
        this.operatorError = false;
        if (element.options) {
          element.options.forEach((option: any) => {
            if (option.selected === true) {
              option.selected = false;
              option.disabled = true;
            }
          });
        } else if (element.tablabels) {
          element.tablabels.forEach((option: any) => {
            if (option.disabled === false) {
              option.disabled = true;
            }
          });
        }
      } else {
        this.operatorError = true;
      }
    });
  }
  gridCheckbox(tabname: any, radioButtonSelected: any) {
    let gData = {
      tabname: tabname,
      buttonName: radioButtonSelected
    }
    this.gridData.push(gData);
    this.gridData.forEach((element: any, index: any) => {
      console.log(element);
      if (this.gridData.indexOf(element) == -1) {
        this.gridData.splice(index, 1);
      }
    });
  }

  toggleCriteriaOptions(selected: boolean, criteriaOptions: any, index: any, event: any) {
    this.indexValue = index;
    this.criterias.filter((criterialabel: any) => {
      if (criterialabel.name == criteriaOptions.name && event.checked) {
        if (criterialabel.name == "Grid") {
          this.criterias[index].tablabels.forEach((element: any) => {
            element.disabled = selected;
            this.criterias[index].selected = !selected;
          });
          console.log(this.operatorsArray);
          this.accordionFilterEngine(this.operatorsArray, this.indexValue, selected);
          return;
        }
        else {
          this.criterias[index].selected = !selected;
          this.criterias[index].options.forEach((option: any) => {
            option.selected = selected;
            option.disabled = selected;
          });
        }
      }
      else if (criterialabel.name == criteriaOptions.name && !event.checked) {
        if (criterialabel.name == "Grid") {
          this.criterias[index].tablabels.forEach((element: any) => {
            element.disabled = selected;
            this.criterias[index].selected = !selected;
          });
          this.accordionFilterEngine(this.operatorsArray, this.indexValue, selected);
          return;
        }
        console.log('else');
        this.criterias[index].selected = !selected;
        this.criterias[index].options.forEach((option: any) => {
          option.selected = !selected;
          option.disabled = selected;
        });
      }
      this.accordionFilterEngine(this.operatorsArray, this.indexValue, selected);
    });

  }

  checkOperatorSelectionCount(array: any) {
    if (array.length == 1) {
      this.mapWindowSplitCount = 3;
    }
    else if (array.length == 2 || array.length == 3) {
      this.mapWindowSplitCount = 1
    }
  }

  accordionFilterEngine(array: any, index: any, selected: any) {
    if (array.length == 0) {
      let count = 0;
    }
    else if (array.length == 1) {
      let count = 3;
      this.disableCriteriaAccordionsFn(count);
    }
    else if (array.length == 2) {
      let count = 1;
      this.disableCriteriaAccordionsFn(count);
    }
    else {
      let count = 1;
      this.disableCriteriaAccordionsFn(count);
    }

  }


  disableCriteriaAccordionsFn(counter: any) {
    this.criterias.forEach((element: any, index: any) => {
      if (element.selected === true) {
        counter--;
        if (counter == 0) {
          var results = this.criterias.filter((entry: any, index: any) => {
            return entry.selected === false;
          });
          results.forEach((value: any) => {
            value.disabled = true;
            value.selected = false;
            value.accordionState = true;
          });
          return
        }
      }
    });
  }

  resetForm() {
    console.log("reset", this.operatorsArray)
    this.selectedButtonToggle = undefined;
    this.criterias.forEach((element: any, index: any) => {
      element.selected = false;
      element.disabled = true;
      element.expanded = false;
      element.accordionState = true;
      console.log(element);
      if (element.name == "Grid") {
        element.tablabels.forEach((element: any, index: any) => {
          element.disabled = true;
        });
      }
      else {
        element.options.forEach((option: any) => {
          option.disabled = true;
        });
      }
      //this.operatorsArray = [];
      this.selectedButtonToggle = undefined;

    });
    //this.expanded = false;
  }

  optionSelected(optionSelected: any, criteria: any,) {
    if (this.criteriaOptionsArray.indexOf(optionSelected.name) == -1) {
      this.criteriaOptionsArray.push(optionSelected.name)
    }
    else {
      let index = this.criteriaNamesArray.indexOf(optionSelected.name);
      this.criteriaOptionsArray.splice(index, 1);
    }
    this.payloadData();
  }

  payloadData() {
    var payloadDataObject = [{
      "dataStreamJSON": this.myJioDataCall || this.lsrJioDataCall,
      "criteriaPayload": this.getCheckedItemList(),
      "operators": this.operatorsArray
    }]
    this.finalPayload = payloadDataObject;
  }

  // GET ALL CHECKED ITEMS
  getCheckedItemList() {
    this.checkedList = [];
    this.criteriaOptions.forEach((element: any, index: any) => {
      console.log(element);
      if (element.selected == true) {
        var results = element.options.filter((entry: any, index: any) => {
          if (entry.name == "Grid") {
            return;
          }
          return entry.selected === true;
        });

        this.checkedList.push({
          name: element.name,
          o: results
        });
      }
    });
    return this.checkedList;
  }

  submitFormData() {
    console.log(this.finalPayload);
  }
}
