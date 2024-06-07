import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartOptions, ChartType, registerables } from 'chart.js';
import { CryptoService } from 'src/app/service/crypto.service';
import { SurveyService } from 'src/app/service/survey.service';
import { AfterViewInit } from '@angular/core';
import { UtilsService } from 'src/app/service/utils.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SurveyQuestion {
  surveyId: number;
  surveyName: string;
  questionId: number;
  surveyAttemptId:any
  question: string;
  userType: string; // Assuming userType is a string
  sort: number;
  status: string; // Assuming status is a string
  startDate: string; // Assuming startDate is a string
  endDate: string; // Assuming endDate is a string
  ip: string; // Assuming ip is a string
  responsOptions: {
    questionId: any;
    id: number;
    option: string;
    optionId: number | null; // Assuming optionId can be null
    answer: string | null; // Assuming answer can be null
    rating: number | null;
    count: number;
  }[];
}
interface SurveyQuestionreport {
  sno: number
  surveyId: number;
  surveyName: string;
  questionId: number;
  surveyAttemptId:any
  question: string;
  userType: string; // Assuming userType is a string
  sort: number;
  status: string; // Assuming status is a string
  startDate: string; // Assuming startDate is a string
  endDate: string;
  options:any 
  ip: string; 
  responsOptions: {
    questionId: any;
    id: number;
    option: string;
    optionId: number | null; // Assuming optionId can be null
    answer: string | null; // Assuming answer can be null
    rating: number | null;
    count: number;
  }[]| null;
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {

  @ViewChild('content') content: ElementRef;
  showForPDF: boolean = false;
  surveyId: any;
  reportsurveyid: any;
  surveyReport: any;
  planid: any;
  surveyReportById: SurveyQuestion[] = [];
  defaultchart: any[] = [];
  graphtypevalue: any;
  selectedusertype: string = 'Select';

  constructor(
    public themeService: SurveyService,
    private route: ActivatedRoute,
    private crypto: CryptoService,
    private utils: UtilsService
  ) {
    this.route.paramMap.subscribe(params => {
      let _queryData = params.get('param1');
      this.surveyId = _queryData;
      if (_queryData) {
        let _queryDecodedData = this.crypto.decryptQueryParam(_queryData);
        let _data = _queryDecodedData.split('_');
        this.reportsurveyid = _data[0];
      }
    })
    Chart.register(...registerables);
  }

  chartType: string = 'line';
  validChartTypes: { [key: string]: ChartType } = {
    line: 'line',
    bar: 'bar',
    doughnut: 'doughnut',
    radar: 'radar',
  };

  charts: Chart[] = [];

 usertype:any[]=['preview','live','universal','test']



  ngOnInit(): void {
    this.planid = this.utils.getPlanId();
    this.getSurveyReportBySurveyId();
    this.getSurveyReport()
  }

  graphType(event: any) {
    this.graphtypevalue = event.target.value;
    console.log("graphtypevalue", this.graphtypevalue)
    this.createCharts();
  }

  createCharts(): void {
    if (this.surveyReportById.length === 0) {
      console.error("Survey report data is empty.");
      return;
    }

    this.surveyReportById.forEach((item, index) => {
      const canvasId = `canvas${index + 1}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;

      if (this.defaultchart[index]) {
        this.defaultchart[index].destroy();
      }

      if (!canvas) {
        console.error(`Canvas element with ID ${canvasId} not found.`);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error(`Failed to get 2D context for canvas element with ID ${canvasId}.`);
        return;
      }

      const datasets = item.responsOptions
        .filter(option => option.option !== null)
        .map(option => ({
          label: option.option,
          data: [option.count],
          backgroundColor: this.getRandomColor()
        }));

      let chartType: ChartType = 'bar';
      if (this.graphtypevalue == 1) {
        chartType = 'doughnut';
      } else if (this.graphtypevalue == 2) {
        chartType = 'bar';
      } else if (this.graphtypevalue == 3) {
        chartType = 'polarArea';
      } else if (this.graphtypevalue == 4) {
        chartType = 'line';
      }

      this.defaultchart[index] = new Chart(ctx, {
        type: chartType,
        data: {
          labels: item.responsOptions.map(option => option.option),
          datasets: datasets
        },
        options: {
          indexAxis: 'x',
          scales: {
            x: {
              display: false, // Display the x-axis
              title: {
                display: true,
                text: 'Question Options' // Add a title to the x-axis if needed
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  surveyname: any[] = [];
  getSurveyReportBySurveyId() {
    if (this.surveyId) {
      this.themeService.getSurveyReportBySurveyId(this.surveyId).subscribe((data: any) => {
        this.surveyReportById = data;
        this.surveyReportById.forEach((item: any) => {
          this.surveyname = item.surveyName
        })
        setTimeout(() => {
          this.createCharts();
        }, 5000); // 5 seconds in milliseconds
      });
    } else {
      console.error("Survey ID is null or undefined.");
    }
  }

  // Function to generate CSV data
  generateCSV(): void {
    const csvContent = this.convertToCSV(this.surveyreport);
    this.downloadCSV(csvContent, 'Survey_Report.csv');
  }

  // convertToCSV(data: SurveyQuestionreport[]): string {
  //   const headerFields = ['S.No', 'Survey ID', 'Survey Name', 'Survey Attempt ID', 'Start Date', 'End Date', 'Status', 'Link Type', 'IP Address'];
  
  //   // Collect unique questions and add them to the header
  //   const questions: { [questionId: number]: string } = {};
  //   data.forEach(item => {
  //     questions[item.questionId] = item.question;
  //   });
  //   Object.values(questions).forEach(question => {
  //     headerFields.push(question);
  //   });
  
  //   // Add BOM for UTF-8 encoding
  //   let csvContent = '\uFEFF' + headerFields.join(',') + '\n';
  
  //   // Group data by surveyAttemptId
  //   const groupedData: { [attemptId: string]: any } = {};
  //   data.forEach(item => {
  //     if (!groupedData[item.surveyAttemptId]) {
  //       groupedData[item.surveyAttemptId] = {
  //         sort: item.sort,
  //         surveyId: item.surveyId,
  //         surveyName: item.surveyName,
  //         surveyAttemptId: item.surveyAttemptId,
  //         startDate: item.startDate,
  //         endDate: item.endDate || '',
  //         status: item.status,
  //         userType: item.userType,
  //         ip: item.ip,
  //         responses: {}
  //       };
  //     }
  //     groupedData[item.surveyAttemptId].responses[item.questionId] = item.options;
  //   });
  
  //   // Build the rows from the grouped data
  //   Object.values(groupedData).forEach(attempt => {
  //     const row = [
  //       attempt.sort,
  //       attempt.surveyId,
  //       attempt.surveyName,
  //       attempt.surveyAttemptId,
  //       attempt.startDate,
  //       attempt.endDate,
  //       attempt.status,
  //       attempt.userType,
  //       attempt.ip
  //     ];
  
  //     Object.keys(questions).forEach(questionId => {
  //       row.push(attempt.responses[questionId] || '');
  //     });
  
  //     // Wrap fields in double quotes to handle special characters and commas
  //     csvContent += row.map(value => `"${value}"`).join(',') + '\n';
  //   });
  
  //   return csvContent;
  // }


 convertToCSV(data: SurveyQuestionreport[]): string {
  const headerFields = [
    'S.No',
    'Survey ID',
    'Survey Name',
    'Survey Attempt ID',
    'Start Date',
    'End Date',
    'Status',
    'Link Type',
    'IP Address'
  ];

  // Collect unique questions and add them to the header
  const questions: { [questionId: number]: string } = {};
  data.forEach(item => {
    questions[item.questionId] = item.sort + '.' + item.question.replace(/<[^>]+>/g, '');
  });
  Object.values(questions).forEach(question => {
    headerFields.push(question);
  });

  // Add BOM for UTF-8 encoding
  let csvContent = '\uFEFF' + headerFields.map(value => `"${value}"`).join(',') + '\n';

  // Group data by surveyAttemptId
  let sno = 1;
  const groupedData: { [attemptId: string]: any } = {};
  data.forEach(item => {
    if (!groupedData[item.surveyAttemptId]) {
      groupedData[item.surveyAttemptId] = {
        surveyId: item.surveyId,
        surveyName: item.surveyName,
        surveyAttemptId: item.surveyAttemptId,
        startDate: item.startDate,
        endDate: item.endDate || '',
        status: item.status,
        userType: item.userType,
        ip: item.ip,
        responses: {}
      };
    }
    groupedData[item.surveyAttemptId].responses[item.questionId] = item.options;
  });

  // Build the rows from the grouped data
  Object.values(groupedData).forEach(attempt => {
    const row = [
      sno++,
      attempt.surveyId,
      attempt.surveyName,
      attempt.surveyAttemptId,
      attempt.startDate,
      attempt.endDate,
      attempt.status,
      attempt.userType,
      attempt.ip
    ];

    Object.keys(questions).forEach(questionId => {
      row.push(attempt.responses[questionId] || '');
    });

    // Wrap fields in double quotes to handle special characters and commas
    csvContent += row.map(value => `"${value}"`).join(',') + '\n';
  });

  return csvContent;
}

  
  
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

  quesgraphtypevalue: string[] = [];
  questiongraphType(event: Event, ques: number): void {
    const target = event.target as HTMLInputElement;
    alert(target.value)
    this.quesgraphtypevalue[ques] = target.value;
    console.log("quesgraphtypevalue", this.quesgraphtypevalue[ques]);
    // this.updatechart(this.quesgraphtypevalue[ques], ques)
  }

  // generatePDF(): void {
  //   this.showForPDF = true;
  //   setTimeout(() => {
  //     let content = this.content.nativeElement;
  //     html2canvas(content).then(canvas => {
  //         const imgData = canvas.toDataURL('image/png');
  //         const pdf = new jsPDF('p', 'mm', 'a4');
  //         const imgWidth = 210;
  //         const pageHeight = 295;
  //         const imgHeight = canvas.height * imgWidth / canvas.width;
  //         let heightLeft = imgHeight;
  //         let position = 0;

  //         // Calculate the horizontal center position
  //         const xCenter = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

  //         pdf.addImage(imgData, 'PNG', xCenter, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;

  //         while (heightLeft >= 0) {
  //             position = heightLeft - imgHeight;
  //             pdf.addPage();
  //             pdf.addImage(imgData, 'PNG', xCenter, position, imgWidth, imgHeight);
  //             heightLeft -= pageHeight;
  //         }

  //         pdf.save('report.pdf');
  //         this.showForPDF = false;
  //     });
  //   },200);
    
  // }


  generatePDF(): void {
    this.showForPDF = true;
    setTimeout(() => {
      let content = this.content.nativeElement;
      html2canvas(content).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          // Calculate the horizontal center position
          const xCenter = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

          while (heightLeft >= 0) {
              if (position + imgHeight > pageHeight) {
                  // If not enough space left, add a new page
                  pdf.addPage();
                  position = 0; // Start from top of the new page
              }
              const spaceLeftOnPage = pageHeight - position;
              const heightToDraw = Math.min(spaceLeftOnPage, imgHeight);
              pdf.addImage(imgData, 'PNG', xCenter, position, imgWidth, heightToDraw);
              position += heightToDraw;
              heightLeft -= heightToDraw;
          }

          pdf.save('report.pdf');
          this.showForPDF = false;
      });
    },200);
    
} 




  surveyreport:SurveyQuestionreport[] = [];
  getSurveyReport() {
    if (this.surveyId) {
      this.themeService.getReport(this.surveyId).subscribe((data: any) => {
        this.surveyreport = data;
      });
    } else {
      console.error("Survey ID is null or undefined.");
    }
  }

  // updatechart(chartindex: any, ques: number): void {
  //   this.defaultchart.destroy();

  //   this.surveyReportById.forEach((question, index) => {

  //     if (question.questionId == ques) {

  //       const canvasId = `canvas${chartindex}`;
  //       const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  //       console.log(chartindex);
  //       if (!canvas) {
  //         console.error(`Canvas element with ID ${canvasId} not found.`);
  //         return;
  //       }

  //       const ctx = canvas.getContext('2d');

  //       if (!ctx) {
  //         console.error(`Failed to get 2D context for canvas element with ID ${canvasId}.`);
  //         return;
  //       }
  //       console.log("ques", ques)
  //       console.log("this.surveyReportById[ques]", this.surveyReportById)

  //       const datasets = question.responsOptions
  //         .filter(option => option.option !== null)
  //         .map(option => ({
  //           label: option.option,
  //           data: [option.count],
  //           backgroundColor: this.getRandomColor(),

  //         }));


  //       this.updatedchat = new Chart(ctx, {

  //         type: 'doughnut',
  //         data: {
  //           labels: question.responsOptions.map(option => option.option),
  //           datasets: datasets
  //         },
  //         options: {
  //           indexAxis: 'x',
  //           scales: {
  //             x: {
  //               display: false, // Display the x-axis
  //               title: {
  //                 display: true,
  //                 text: 'Question Options' // Add a title to the x-axis if needed
  //               }
  //             },
  //             y: {
  //               beginAtZero: true
  //             }
  //           }
  //         }
  //       });
  //     }

  //   });
  // }
}
