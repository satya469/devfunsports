import { Component, OnInit } from '@angular/core';
import {GridOptions} from "ag-grid-community";
import { ReportsService } from '../services/reports.service';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';

export function getTimepickerConfig(): TimepickerConfig {
  return Object.assign(new TimepickerConfig(), {
    hourStep: 1,
    minuteStep: 1,
    secondsStep:1,
    showMeridian: false,
    readonlyInput: false,
    mousewheel: true,
    showMinutes: true,
    showSeconds: false,
    labelHours: 'Hours',
    labelMinutes: 'Minutes',
    labelSeconds: 'Seconds'
  });
}
@Component({
  selector: 'app-accout-statement',
  templateUrl: './accout-statement.component.html',
  styleUrls: ['./accout-statement.component.css'],
  providers: [{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class AccoutStatementComponent implements OnInit {
  gridOptions: GridOptions;
  columnDefs:any
  paginationPageSize:any;
  paginationSetPageSize;
  paginationNumberFormatter:any;
  rowData=[];
  gridApi: any;
  gridColumnApi: any;
  date: Date;
  fromdate: string;
  todate: string;
  selectfromdate: any;
  selecttodate: any;
  selectfromtime: any;
  selecttotime: any;
  dropdownList=[];
  selectedItems=[];
  dropdownSettings: { };
  bsRangeValue: Date[];
  bsValue = new Date();
  maxDate = new Date();

  myDateValue:Date;
  datepicker: Date;
  overlayLoadingTemplate: string;
  overlayNoRowsTemplate: string;
  defaultColDef: { sortable: boolean; };

  constructor(private getreports:ReportsService) {
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
      {headerName: 'Date', field: '',sort: "desc",resizable: true, sortable: true, minWidth: 100,width:150,suppressSizeToFit: true,lockPosition:true,suppressNavigable:true},
      {headerName: 'Type', field: '', sortable: true,resizable: true, minWidth: 100,width:150,suppressSizeToFit: true,cellStyle: {'font-weight':'bolder'}},
      {headerName: 'Description', field: '', sortable: true,resizable: true, minWidth: 250,width:600,suppressSizeToFit: true,cellStyle: {'font-weight':'bolder'}},
      {headerName: 'Dr', field: '',resizable: true, sortable: true, minWidth: 100,width:100,suppressSizeToFit: true,valueFormatter: numberWithCommas,cellClass: function(params) { return (params.value >= 0 ? 'profit':'loss')}},
      {headerName: 'Cr', field: '',resizable: true, sortable: true, minWidth: 100,width:100,suppressSizeToFit: true,valueFormatter: numberWithCommas,cellClass: function(params) { return (params.value >= 0 ? 'profit':'loss')}},
      {headerName: 'Balance', field: '',resizable: true, sortable: true, minWidth: 100,valueFormatter: numberWithCommas,cellClass: function(params) { return (params.value >= 0 ? 'profit':'loss')}}
    ];


    function numberWithCommas(params) {

        var twodecimalvalue=parseFloat(params.value);
        var ans= twodecimalvalue.toLocaleString('en-IN',{ currency: "INR",minimumFractionDigits:2,maximumFractionDigits:2 });
        return ans;
    }

    this.overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
    this.overlayNoRowsTemplate =
    '<span class="ag-overlay-loading-center">NO DATA</span>';


    this.gridOptions.paginationPageSize=50;
    this.gridOptions.paginationNumberFormatter = function(params) {
      return "[" + params.value.toLocaleString() + "]";
    };


    this.selectfromdate = new Date(new Date().setDate(new Date().getDate() - 1));
    this.selecttodate = new Date();
    this.selectfromtime = new Date(new Date().setHours(10, 0, 0, 0));
    this.selecttotime = new Date(new Date().setHours(9,59,59,0));
  }

  onPageSizeChanged(newPageSize:any) {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridOptions.api.paginationSetPageSize(Number(value));
  }

  onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((document.getElementById('filter-text-box') as HTMLInputElement).value);
  }

  ngOnInit() {
    this.dropdownList = [
      {"itemName":"Cash"},
      {"itemName":"Credit"},
      {"itemName":"Show D|W  Point"},
      {"itemName":"Show Market P|L"},
      {"itemName":"Cash & P|L"}

    ];
this.selectedItems = [];
this.dropdownSettings = {
          singleSelection: false,
          text:"Select",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: true,
          classes:"myclass custom-class"
        };
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.showLoadingOverlay();
        var days = 1;
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        this.date = last
        this.fromdate = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + (this.date.getDate()) + " 09:59:00";
        this.todate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 09:59:00";
        let accdates={
          "fromdate":this.fromdate,
          "todate":this.todate
        }
      // this.getreports.GetAccountStatement('',accdates).subscribe(resp=>{
      //   this.rowData=resp.data;

      // })
  }

  accountstatement(){

    console.log(this.selectfromdate,this.selecttodate);
     let accdates={
       "fromdate":this.getFromDateAndTime(),
       "todate":this.getToDateAndTime()
     }
    //  this.getreports.GetAccountStatement('',accdates).subscribe(resp =>{
    //    this.rowData=resp.data;
    //  })
  }

  fromDateChange(date) {
    console.log(date);
  }
  toDateChange(date) {
    console.log(date);
  }

  fromTimeChange(time) {
    console.log(time);
  }

  toTimeChange(time) {
    console.log(time);
  }

  getFromDateAndTime() {
    return `${this.selectfromdate.getFullYear()}-${this.selectfromdate.getMonth() + 1}-${this.selectfromdate.getDate()} ${this.selectfromtime.getHours()}:${this.selectfromtime.getMinutes()}:${this.selectfromtime.getSeconds()}`;
  }
  getToDateAndTime() {
    return `${this.selecttodate.getFullYear()}-${this.selecttodate.getMonth() + 1}-${this.selecttodate.getDate()} ${this.selecttotime.getHours()}:${this.selecttotime.getMinutes()}:${this.selecttotime.getSeconds()}`;
  }

  convertfrom(str) {
    var date = new Date(str);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
  convertto(str) {
    var date = new Date(str);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }



    onItemSelect(item:any){
        // console.log(this.selectedItems);
        console.log(this.bsRangeValue);
        this.selectfromdate=this.convertfrom(this.bsRangeValue[0]);
        this.selecttodate=this.convertto(this.bsRangeValue[1]);
        console.log(this.selectfromdate,this.selecttodate);
        let accdates={
          "fromdate":this.selectfromdate,
          "todate":this.selecttodate
        }
        // this.getreports.GetAccountStatement(this.selectedItems[0].id,accdates).subscribe(resp =>{
        //   this.rowData=resp.data;
        // })
    }
    OnItemDeSelect(item:any){
        // console.log(this.selectedItems);
        this.selectfromdate=this.convertfrom(this.bsRangeValue[0]);
        this.selecttodate=this.convertto(this.bsRangeValue[1]);
        console.log(this.selectfromdate,this.selecttodate);
        let accdates={
          "fromdate":this.selectfromdate,
          "todate":this.selecttodate
        }
        // this.getreports.GetAccountStatement(this.selectedItems[0].id,accdates).subscribe(resp =>{
        //   this.rowData=resp.data;
        // })
    }
    onSelectAll(items: any){
        console.log(items);
    }
    onDeSelectAll(items: any){
        console.log(items);
    }

}
