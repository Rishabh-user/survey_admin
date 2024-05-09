import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import { CryptoService } from 'src/app/service/crypto.service';
import { SurveyService } from 'src/app/service/survey.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  surveyId: any;
  reportsurveyid:any
  surveyReport: any;
  surveyReportById: any;
  constructor( public themeService: SurveyService,private route: ActivatedRoute, private crypto: CryptoService,) {
    this.route.paramMap.subscribe(params => {
      let _queryData = params.get('param1');
      console.log("qwerty", _queryData)
      this.surveyId = _queryData;
      if (_queryData) {
        let _queryDecodedData = this.crypto.decryptQueryParam(_queryData);
        let _data = _queryDecodedData.split('_');
        this.reportsurveyid = _data[0];
      }
    })
  }
  chartType: string = 'line';
  validChartTypes: { [key: string]: ChartType } = {
    line: 'line',
    bar: 'bar',
    doughnut: 'doughnut',
    radar: 'radar',
  };

  charts: Chart[] = [];

  ngOnInit(): void {
    //this.createChart('canvas1');
    //this.createChart('canvas2');
    this.getSurveyReportBySurveyId();
  }

  // createChart(canvasId: string) {
  //   const existingChart = this.getChartByCanvasId(canvasId);
  //   if (existingChart) {
  //     existingChart.destroy();
  //   }

  //   if (this.validChartTypes[this.chartType]) {
  //     const chartData: ChartData = {
  //       labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  //       datasets: [
  //         {
  //           label: 'Dataset 1',
  //           data: [5, 10, 15, 10, 20, 18, 25, 35, 28, 22, 25, 55],
  //         },
  //         {
  //           label: 'Dataset 2',
  //           data: [5, 10, 15, 10, 20, 18, 25, 35, 28, 22, 25, 55],
  //         }
  //       ]
  //     };

  //     const chartOptions: ChartOptions = {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //         },
  //         title: {
  //           display: true,
  //           text: 'Chart.js Line Chart'
  //         }
  //       }
  //     };

  //     const newChart = new Chart(canvasId, {
  //       type: this.validChartTypes[this.chartType],
  //       data: chartData,
  //       options: chartOptions
  //     });

  //     this.charts.push(newChart);
  //   }
  // }

  // onChartTypeChange(event: any, canvasId: string) {
  //   const selectedType = event.target.value;
  //   if (this.validChartTypes[selectedType]) {
  //     this.chartType = selectedType;
  //     this.createChart(canvasId);
  //   }
  // }

  // private getChartByCanvasId(canvasId: string): Chart | undefined {
  //   return this.charts.find(chart => chart.ctx.canvas.id === canvasId);
  // }

  
  getSurveyReportBySurveyId() {
    if (this.surveyId) { 
      this.themeService.getSurveyReportBySurveyId(this.surveyId).subscribe((data: any) => {
        this.surveyReportById = data;
        console.log("Reports", this.surveyReportById);
      });
    } else {
      console.error("Survey ID is null or undefined.");
    }
  }
  // Function to generate CSV data
  generateCSV(): void {
    // Convert survey report data to CSV format
    const csvContent = this.convertToCSV(this.surveyReportById);    
    this.downloadCSV(csvContent, 'survey_report.csv');
}

// Function to convert data to CSV format
convertToCSV(data: any[]): string {
    // Define the header fields
    const headerFields = ['Survey ID', 'Survey Name', 'Question ID', 'Question', 'Option ID', 'Answer', 'Rating ID', 'Survey Attempt ID', 'Count'];

    // Create the CSV content with the header row
    let csvContent = headerFields.join(',') + '\n';

    // Iterate over the data and format each row
    data.forEach(item => {
        const formattedRow = [
            item.surveyId,
            `"${item.surveyName}"`, // Wrap in double quotes to handle commas in data
            item.questionId,
            `"${item.question}"`, // Wrap in double quotes to handle commas in data
            item.optionId,
            item.answer,
            item.ratingId,
            item.surveyAttemptId,
            item.count
        ].join(',');
        csvContent += formattedRow + '\n';
    });

    return csvContent;
}

// Function to trigger file download
downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if ((navigator as any).msSaveBlob) { // IE 10+
        (navigator as any).msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
}
