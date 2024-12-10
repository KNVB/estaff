import ExcelJS from 'exceljs';
export default class RosterExporter {
	constructor() {
		let centerAligment = { horizontal: 'center', vertical: 'middle' };
		let centerWithWrapTextAligment = { ...centerAligment, ...{ wrapText: true } };
		let firstRosterRowIndex = 7;
		let fullBorderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
		let timesNewRomanFont12 = { name: "Times New Roman", size: 12 };
		let timesNewRomanFont14 = { name: "Times New Roman", size: 14 };
		this.export = async (rosterData) => {
			let workbook = new ExcelJS.Workbook();
			await workbook.xlsx.readFile('./template.xlsx');
			let worksheet1 = workbook.getWorksheet('Sheet1');
			//console.log(rosterData);
			setCaptionRow(workbook, rosterData.month, rosterData.year);
			setConditionalFormatting(worksheet1, rosterData.roster);
			setHeaderRow(worksheet1, rosterData.calendarDateList, rosterData.weekdayNames);
			setRosterData(worksheet1, rosterData.roster, rosterData.activeShiftList);
			setVacantShiftRow(rosterData.roster, worksheet1, rosterData.vacantShiftList);
			return await workbook.xlsx.writeBuffer();
		}
		//======================================================================================
		function genCountIf(address, target) {
			let result = '(COUNTIF(' + address + ',"' + target + '"))';
			return result;
		}
		function getHolidayCell(calendarDate) {
			let colorCode = '', phLabel = "";
			if ((calendarDate.isPublicHoliday) && (calendarDate.dayOfWeek !== 0)) {
				colorCode = { argb: 'FFFF0000' };
				phLabel = "PH";
			} else {
				colorCode = { argb: 'FF000000' };
				phLabel = "";
			}
			return {
				richText: [
					{
						font:
						{
							bold: true,
							color: colorCode,
							name: "Times New Roman",
							size: 12,
						},
						text: phLabel
					}
				]
			};
		}
		function getWeekdayCell(calendarDate, weekdayNames) {
			let colorCode = '';
			if ((calendarDate.dayOfWeek === 6) || (calendarDate.isPublicHoliday)) {
				colorCode = { argb: 'FFFF0000' };
			} else {
				colorCode = { argb: 'FF000000' };
			}
			return {
				richText: [
					{
						font:
						{
							color: colorCode,
							name: "Times New Roman",
							size: 12,
						},
						text: weekdayNames[calendarDate.dayOfWeek]
					}
				]
			};
		}
		function setCaptionRow(workbook, rosterMonth, rosterYear) {
			let worksheet1 = workbook.getWorksheet('Sheet1');
			let worksheet2 = workbook.getWorksheet('Sheet2');
			worksheet1.getCell('B2').value = (worksheet2.getCell("A" + (rosterMonth)).value) + " " + rosterYear;
		}
		function setConditionalFormatting(worksheet, roster) {
			let lastRowIndex = firstRosterRowIndex + Object.keys(roster).length - 1;
			let address = "B" + firstRosterRowIndex + ":AF" + lastRowIndex;

			worksheet.addConditionalFormatting({
				ref: address,
				rules: [
					{
						type: 'cellIs',
						operator: 'equal',
						formulae: ['"a"'],
						style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFF99CC' } } },
					},
					{
						type: 'cellIs',
						operator: 'equal',
						formulae: ['"c"'],
						style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFCCFFCC' } } },
					},
					{
						type: 'containsText',
						operator: 'containsText',
						text: "b",
						style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFFFCC' } } },
					},
					{
						type: 'containsText',
						operator: 'containsText',
						text: "d",
						style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFCCFFFF' } } },
					}
				]
			});
		}
		function setHeaderRow(worksheet, calendarDateList, weekdayNames) {
			let calendarDate, cell;
			let holidayRow = worksheet.getRow(4);
			let weekdayRow = worksheet.getRow(5);
			let dateRow = worksheet.getRow(6);

			for (let i = 0; i < 31; i++) {
				if (calendarDateList[i]) {
					calendarDate = calendarDateList[i];
					holidayRow.getCell(i + 2).alignment = centerAligment;
					holidayRow.getCell(i + 2).value = getHolidayCell(calendarDate);
					weekdayRow.getCell(i + 2).value = getWeekdayCell(calendarDate, weekdayNames);
					weekdayRow.getCell(i + 2).alignment = centerAligment;
					dateRow.getCell(i + 2).value = calendarDate.dateOfMonth;
				}
			}
		}
		function setRosterData(worksheet, rosterList, shiftInfoList) {
			let address, cell, i;
			let formula = "";
			//let itoCount=itoIdList.length;
			let j, row, rowIndex = firstRosterRowIndex;

			for (let itoId in rosterList) {
				let roster = rosterList[itoId];
				worksheet.insertRow(rowIndex, {});
				row = worksheet.getRow(rowIndex);
				cell = row.getCell(1);
				cell.alignment = { wrapText: true };
				cell.border = fullBorderStyle;
				cell.font = timesNewRomanFont12;
				cell.value = roster.itoName + "\n" + roster.itoPostName + " Extn. 2458";
				for (i = 1; i < 32; i++) {
					cell = row.getCell(i + 1);
					cell.alignment = centerAligment;
					cell.border = fullBorderStyle;
					cell.font = timesNewRomanFont14;
					if (roster.shiftList[i]) {
						cell.value = roster.shiftList[i];
					}
				}
				cell = worksheet.getCell("AG" + rowIndex);
				cell.alignment = centerAligment;
				cell.border = fullBorderStyle;
				cell.font = timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value = roster.expectedWorkingHour;

				address = "B" + rowIndex + ":AF" + rowIndex;
				formula = genCountIf(address, 'a') + "*" + shiftInfoList["a"].duration + "+";
				formula += genCountIf(address, 'b') + "*" + shiftInfoList["b"].duration + "+";
				formula += genCountIf(address, 'b1') + "*" + shiftInfoList["b1"].duration + "+";
				formula += genCountIf(address, 'c') + "*" + shiftInfoList["c"].duration + "+";
				formula += genCountIf(address, 'd') + "*" + shiftInfoList["d"].duration + "+";
				formula += genCountIf(address, 'd1') + "*" + shiftInfoList["d1"].duration + "+";
				formula += genCountIf(address, 'd2') + "*" + shiftInfoList["d2"].duration + "+";
				formula += genCountIf(address, 'd3') + "*" + shiftInfoList["d3"].duration;

				cell = worksheet.getCell("AH" + rowIndex);
				cell.alignment = centerAligment;
				cell.border = fullBorderStyle;
				cell.font = timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value = { "formula": formula };

				cell = worksheet.getCell("AI" + rowIndex);
				cell.alignment = centerAligment;
				cell.border = fullBorderStyle;
				cell.font = timesNewRomanFont14;
				cell.numFmt = '+#0.##;-#0.##';
				cell.value = roster.lastMonthBalance;

				formula = "AH" + rowIndex + "-AG" + rowIndex;
				cell = worksheet.getCell("AJ" + rowIndex);
				cell.alignment = centerAligment;
				cell.border = fullBorderStyle;
				cell.font = timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value = { "formula": formula, result: roster.thisMonthHourTotal };

				formula = "AJ" + rowIndex + "+AI" + rowIndex;
				cell = worksheet.getCell("AK" + rowIndex);
				cell.alignment = centerAligment;
				cell.border = fullBorderStyle;
				cell.font = timesNewRomanFont14;
				cell.numFmt = '0.00';
				cell.value = { "formula": formula };

				formula = genCountIf(address, 'a');
				cell = worksheet.getCell("AL" + rowIndex);
				cell.value = { "formula": formula };

				formula = genCountIf(address, 'b') + "+";
				formula += genCountIf(address, 'b1');
				cell = worksheet.getCell("AM" + rowIndex);
				cell.value = { "formula": formula };

				formula = genCountIf(address, 'c');
				cell = worksheet.getCell("AN" + rowIndex);
				cell.value = { "formula": formula };

				formula = genCountIf(address, 'd') + "+";
				formula += genCountIf(address, 'd1') + "+";
				formula += genCountIf(address, 'd2') + "+";
				formula += genCountIf(address, 'd3');
				cell = worksheet.getCell("AO" + rowIndex);
				cell.value = { "formula": formula };

				formula = genCountIf(address, 'O');
				cell = worksheet.getCell("AP" + rowIndex);
				cell.value = { "formula": formula };

				formula = 'SUM(AL' + rowIndex + ':AO' + rowIndex + ')';
				cell = worksheet.getCell("AQ" + rowIndex);
				cell.value = { "formula": formula };

				rowIndex++;
			}
		}
		function setVacantShiftRow(rosterList, worksheet, vacantShiftList) {
			let cell, vacantRow = worksheet.getRow(firstRosterRowIndex + Object.keys(rosterList).length);
			for (let i = 2; i < 33; i++) {
				cell = vacantRow.getCell(i);
				cell.alignment = centerAligment;
				cell.font = timesNewRomanFont12;
				if (vacantShiftList[i - 1]) {
					cell.value = vacantShiftList[i - 1];
				}
			}
		}
	}
}