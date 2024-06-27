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

 csv:any[]=['CSV(ques)','CSV(count)','CSV(optioncount)']

 onSelectChangegraph(event: Event): void {
  const selectedValue = (event.target as HTMLSelectElement).value;
  if (selectedValue === '1') {
    this.generateCSV();
  }
  if (selectedValue === '2') {
    this.generateCountCSV();
  }
  // if (selectedValue === '3') {
  //   this.generateOptionCountCSV();
  // }
}



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

    // Collect unique questions in the order they appear in 'data'
    const questions: { [questionId: number]: string } = {};
    const orderedQuestions: string[] = [];

    data.forEach(item => {
        if (!questions[item.questionId]) {
            questions[item.questionId] = item.sort + '.' + item.question.replace(/<[^>]+>/g, '');
            orderedQuestions.push(questions[item.questionId]);
        }
    });

    // Add the ordered questions to the header
    orderedQuestions.forEach(question => {
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

    // Helper function to format date and time
    const formatDateTime = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Build the rows from the grouped data
    Object.values(groupedData).forEach(attempt => {
        const row: (string | number)[] = [
            sno++,
            attempt.surveyId,
            attempt.surveyName,
            attempt.surveyAttemptId,
            formatDateTime(attempt.startDate),
            formatDateTime(attempt.endDate),
            attempt.status,
            attempt.userType,
            attempt.ip
        ];

        orderedQuestions.forEach(question => {
            const questionId = Object.keys(questions).find(key => questions[+key] === question);
            if (questionId !== undefined) {
                row.push(attempt.responses[+questionId] || '');
            } else {
                row.push('');
            }
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

  showpdf:boolean= false

  // generatePDF(): void {
  //   this.showForPDF = true;
  //   this.showpdf = !this.showpdf;
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
  //         this.showpdf = this.showpdf;
  //     });
  //   },200);
    
  // }


  // generatePDF(): void {
  //   this.showForPDF = true;
  //   this.showpdf = !this.showpdf;

  //   setTimeout(() => {
  //     const content = this.content.nativeElement;
  //     html2canvas(content).then(canvas => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF('p', 'mm', 'a4');
  //       const imgWidth = 210;
  //       const pageHeight = 295;
  //       const imgHeight = canvas.height * imgWidth / canvas.width;
  //       let heightLeft = imgHeight;
  //       let position = 0;

  //       // Calculate the horizontal center position
  //       const xCenter = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

  //       // Loop over and add images to the PDF
  //       while (heightLeft > 0) {
  //         pdf.addImage(imgData, 'PNG', xCenter, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //         if (heightLeft > 0) {
  //           position = heightLeft - imgHeight;
  //           pdf.addPage();
  //         }
  //       }

  //       pdf.save('report.pdf');
  //       this.showForPDF = false;
  //       this.showpdf = this.showpdf;
  //     });
  //   });
  // }

  surveyreport:SurveyQuestionreport[] = [];
  getSurveyReport() {
    if (this.surveyId) {
      this.themeService.getReport(this.surveyId).subscribe((data: any) => {
        this.surveyreport = data;
        console.log("this",this.surveyreport)
      });
    } else {
      console.error("Survey ID is null or undefined.");
    }
  }


  generatePDF(): void {
    this.showForPDF = true;
    this.showpdf = !this.showpdf;

    setTimeout(() => {
        const content = this.content.nativeElement;
        const items = content.querySelectorAll('ol > li');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = 295;
        const imgWidth = 210;
        const margin = 10;
        const graphPerPage = 3;
        const lineHeight = 10; // Adjust based on your content's font size
        let currentYPosition = margin + lineHeight; // Leave space for the survey name

        const addSurveyNameToPDF = () => {
            pdf.setFontSize(16);
            pdf.text(this.surveyname, pdf.internal.pageSize.getWidth() / 2, margin, { align: 'center' });
            currentYPosition += lineHeight;
        };

        const addItemToPDF = (item:any, position:any, callback:any) => {
            html2canvas(item).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgHeight = canvas.height * imgWidth / canvas.width;

                if (position + imgHeight > pageHeight) {
                    pdf.addPage();
                    addSurveyNameToPDF();
                    position = currentYPosition;
                }

                const xCenter = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
                pdf.addImage(imgData, 'PNG', xCenter, position, imgWidth, imgHeight);
                currentYPosition = position + imgHeight + margin;

                callback();
            });
        };

        const processNextItem = () => {
            if (currentGraphIndex < items.length) {
                const item = items[currentGraphIndex];
                addItemToPDF(item, currentYPosition, () => {
                    currentGraphIndex++;
                    if (currentGraphIndex % graphPerPage === 0) {
                        pdf.addPage();
                        addSurveyNameToPDF();
                        currentYPosition = margin + lineHeight;
                    }
                    processNextItem();
                });
            } else {
                pdf.save('report.pdf');
                this.showForPDF = false;
                this.showpdf = !this.showpdf;
            }
        };

        let currentGraphIndex = 0;
        addSurveyNameToPDF();
        processNextItem();
    }, 1000); // Adjust timeout to ensure content is fully rendered
}




//   generateOptionCountCSV(): void {
//     const csvContent = this.optionCountConvertToCSV(this.surveyreport);
//     this.downloadCSV(csvContent, 'Survey_Report_Option_Count.csv');
//   }
  
//   optionCountConvertToCSV(data: any[]): string {
//     // Initialize header fields with basic information
//     const headerFields = [
//         'S.No',
//         'Survey ID',
//         'Survey Name',
//         'Survey Attempt ID',
//         'Start Date',
//         'End Date',
//         'Status',
//         'Link Type',
//         'IP Address'
//     ];

//     // Create a map to store questions and their options
//     const questionsWithOptionsMap: Map<string, { question: string; options: string[] }> = new Map();

//     // Iterate over the data and populate the map
//     data.forEach(item => {
//         const key = `${item.questionId}_${item.question}`;
//         if (!questionsWithOptionsMap.has(key)) {
//             questionsWithOptionsMap.set(key, { question: `${item.sort}. ${item.question}`, options: [] });
//         }
//         const options = item.responsOptions.map((option: { option: string }) => option.option);
//         const existingOptions = questionsWithOptionsMap.get(key)?.options || []; // Handle undefined case
//         questionsWithOptionsMap.set(key, {
//             question: `${item.sort}. ${item.question.replace(/<[^>]+>/g, '')}`,
//             options: Array.from(new Set([...existingOptions, ...options]))
//         });
//     });


//     // Add questions and options to header
//     let questionIndex = 1;
//     questionsWithOptionsMap.forEach((value, key) => {
//         headerFields.push(value.question);
//         value.options.forEach((option, oIndex) => {
//             headerFields.push(`${questionIndex}${String.fromCharCode(97 + oIndex)}. ${option}`);
//         });
//         questionIndex++;
//     });

//     // Prepare CSV content
//     let csvContent = '\uFEFF' + headerFields.map(value => `"${value}"`).join(',') + '\n';
//     let sno = 1;

//     // Group data by surveyAttemptId
//     const groupedData: { [attemptId: string]: any[] } = {};
//     data.forEach(item => {
//         if (!groupedData[item.surveyAttemptId]) {
//             groupedData[item.surveyAttemptId] = [];
//         }
//         groupedData[item.surveyAttemptId].push(item);
//     });

//     // Generate rows for each group

//     const formatDateTime = (dateString: string): string => {
//       if (!dateString) return '';
//       const date = new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       return `${day}/${month}/${year} ${hours}:${minutes}`;
//   };
//     for (const attemptId in groupedData) {
//         const items = groupedData[attemptId];
//         const baseItem = items[0];
//         const row = [
//             sno++,
//             baseItem.surveyId,
//             baseItem.surveyName,
//             baseItem.surveyAttemptId,
//             formatDateTime(baseItem.startDate),
//             formatDateTime(baseItem.endDate || ''),
//             baseItem.status,
//             baseItem.userType,
//             baseItem.ip
//         ];

//         // Initialize an object to hold the counts for each option
//         const optionCounts: { [key: string]: number } = {};

//         questionsWithOptionsMap.forEach((value, key) => {
//             value.options.forEach(option => {
//                 optionCounts[`${key}_${option}`] = 0;
//             });
//         });

//         // Populate the optionCounts with counts for each option
//         items.forEach(item => {
//             const key = `${item.questionId}_${item.question}`;
//             item.responsOptions.forEach((response: { option: string }) => {
//                 if (questionsWithOptionsMap.has(key)) {
//                     optionCounts[`${key}_${response.option}`]++;
//                 }
//             });
//         });

//         // Add counts for each option to the row
//         questionsWithOptionsMap.forEach((value, key) => {
//             row.push(''); // Add blank cell for the question column
//             value.options.forEach(option => {
//                 row.push(optionCounts[`${key}_${option}`]);
//             });
//         });

//         csvContent += row.map(value => `"${value}"`).join(',') + '\n';
//     }

//     return csvContent;
// }














  // opitonCountConvertToCSV(data: any[]): string {
  //   const headerFields = [
  //     'S.No',
  //     'Survey ID',
  //     'Survey Name',
  //     'Survey Attempt ID',
  //     'Start Date',
  //     'End Date',
  //     'Status',
  //     'Link Type',
  //     'IP Address'
  //   ];
  
  //   // Collect unique questions with their options in the order they appear in 'data'
  //   const questionsWithOptions: { questionId: number; question: string; options: string[] }[] = [];
  
  //   data.forEach(item => {
  //     if (!questionsWithOptions.some(q => q.questionId === item.questionId)) {
  //       const questionOptions = item.responsOptions.map((option: { option: string }) => option.option);
  //       questionsWithOptions.push({
  //         questionId: item.questionId,
  //         question: `${item.sort}. ${item.question.replace(/<[^>]+>/g, '')}`,
  //         options: questionOptions
  //       });
  //     }
  //   });
  
  //   // Add the ordered questions and their options to the header
  //   questionsWithOptions.forEach((questionWithOptions, qIndex) => {
  //     headerFields.push(questionWithOptions.question);
  //     questionWithOptions.options.forEach((option, oIndex) => {
  //       headerFields.push(`${qIndex + 1}${String.fromCharCode(97 + oIndex)}. ${option}`);
  //     });
  //   });
  
  //   // Add BOM for UTF-8 encoding
  //   let csvContent = '\uFEFF' + headerFields.map(value => `"${value}"`).join(',') + '\n';
  
  //   // Group data by surveyAttemptId
  //   let sno = 1;
  //   const groupedData: { [attemptId: string]: any } = {};
  //   data.forEach(item => {
  //     if (!groupedData[item.surveyAttemptId]) {
  //       groupedData[item.surveyAttemptId] = {
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
  //     groupedData[item.surveyAttemptId].responses[item.questionId] = item.responsOptions;
  //   });
  
  //   // Create rows for each survey attempt
  //   for (const attemptId in groupedData) {
  //     const item = groupedData[attemptId];
  //     const row = [
  //       sno++,
  //       item.surveyId,
  //       item.surveyName,
  //       item.surveyAttemptId,
  //       item.startDate,
  //       item.endDate,
  //       item.status,
  //       item.userType,
  //       item.ip
  //     ];
  
  //     questionsWithOptions.forEach(questionWithOptions => {
  //       const responses = item.responses[questionWithOptions.questionId];
  //       if (responses) {
  //         row.push(''); // Placeholder for the question itself, if needed
  //         questionWithOptions.options.forEach(option => {
  //           const responseOption = responses.find((o: any) => o.option === option);
  //           row.push(responseOption ? responseOption.count : 0);
  //         });
  //       } else {
  //         row.push('');
  //         questionWithOptions.options.forEach(() => row.push(0));
  //       }
  //     });
  
  //     csvContent += row.map(value => `"${value}"`).join(',') + '\n';
  //   }
  
  //   return csvContent;
  // }
  





  generateCountCSV(): void {
    const csvContent = this.countConvertToCSV(this.surveyReportById);
    this.downloadCSV(csvContent, 'Survey_Report_Count.csv');
  }

  countConvertToCSV(data: any[]): string {
    const headerFields = ['Survey ID', 'Survey Name', 'Question ID', 'Question', 'Option', 'Answer', 'Rating', 'Survey Attempt ID', 'Count'];
    let csvContent = headerFields.join(',') + '\n';
    data.forEach(item => {
      item.responsOptions.forEach((option: { option: any; answer: any; rating: any; surveyAttemptId: any; count: any; }) => {
        const formattedRow = [
          item.surveyId,
          `"${item.surveyName}"`,
          item.questionId,
          `"${item.question}"`,
          option.option,
          option.answer,
          option.rating || '',
          option.surveyAttemptId || '',
          option.count
        ].join(',');
        csvContent += formattedRow + '\n';
      });
    });
    return csvContent;
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

  generateBinaryExcel(){
    this.themeService.GetBinaryReport(this.surveyId).subscribe({
      next: (url: string)  => {
        if(url){
          this.downloadFile(url);
          this.utils.showSuccess("Report is downloded")
        }
        
      },
      error: (err:any) =>{
        
      }
    })
  }

  downloadFile(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || 'Binary_Report.xlsx'; // Set a default filename if not present in URL
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
