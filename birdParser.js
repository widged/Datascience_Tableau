#!/usr/bin/env node

var LineReader = require('line-by-line'),
    csv = require('csv'),
	fs	= require('fs');

var msInDay = 86400000, msInHour = 3600000;

function run(fileIn, maxLines) {

	var analyses;
	fs.readFile("birdAnalyses.json", 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		analyses = JSON.parse(data);
		readFile( fileIn, { onLine: onLine, onEnd:  onEnd, maxLines : maxLines} );
	});


	function onLine(line, count) {
		var row = line.split("\t");
		if(count === 1) {
			onFirst(row);
		} else {
			onRow(row, count);
		}
	}

	function onFirst(row) {

		analyses.forEach(function(a, i) {
			if(a.measures)   { a.measures.forEach(function(o) { addColumn(o); }); }
			if(a.dimensions) { a.dimensions.forEach(function(o) { addColumn(o); }); }
			a.data = {};
		});

		function addColumn(obj) {
			var idx = row.indexOf(obj.f);
			obj.c = idx;
		}
	}

	function onRow(row, index) {
		analyses.forEach(function(a, i) {
			var g, m = [], d = [];
			if(a.measures)   { a.measures.forEach(function(o) { m.push(getValue(o, row)); }); }
			if(a.dimensions) { a.dimensions.forEach(function(o) { d.push(getValue(o, row)); }); }
			combineData(a, m, d, whenError);
		});

		function whenError(err) {
			console.log("[ERROR]", index, err, row.join("\t"));
		}


	}

	function onEnd(lineCount) {
		console.log("Number of records", lineCount);
		console.log("--------------");
		console.log(JSON.stringify(analyses[0]));
		console.log("--------------");
		console.log(JSON.stringify(analyses[1]));
		console.log("--------------");
		console.log(JSON.stringify(analyses[2]));
		console.log("--------------");
		console.log(JSON.stringify(analyses[3]));
		console.log("--------------");
		console.log(JSON.stringify(analyses[4]));
		console.log("--------------");
		/*
		fs.writeFile("birdAnalyses2.json", JSON.stringify(analyses), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to ");
		}
		}); 
		*/
	}

}

// ########################
//  Utils 
// ########################

function combineData(a, m, d, whenError) {
	var g, dims, parseFault = false;

	if(d === undefined || d.length === 0) {
		dims = ["all"];
	} else {
		dims = [];
		for(var i = 0, ni = d.length; i < ni; i++  ) {
			g = extractDimension(a.dimensions[i], d[i], whenError);
			if(g === null) { parseFault = true; continue; }
			dims.push(g);
		}
	}

	if(parseFault) { return; }

	g = dims.join("|");

	if(!a.data[g]) { a.data[g] = []; }
	var gp = a.data[g], di, val;
	for(var j = 0, nj = m.length; j < nj; j++  ) {
		if(!gp[j]) { gp[j] = {}; }
		updateData(m[j], gp[j]);
	}


}

function updateData(val, dim) {
	val = forceNumber(val);
	if(!dim.count) { dim.count = 0; }
	dim.count += 1;
	if(val !== null && val !== undefined) {
		if(!dim.sum)   { dim.sum = 0; }
		dim.sum   += val;
		if(!dim.min || dim.min > val) { dim.min = val; }
		if(!dim.max || dim.max < val) { dim.max = val; }
	}
}

function extractDimension(dim, d, onError) {
	var re = /^(\d+)\/(\d+)\/(\d+)/, match, dd, mm, yy, date;
	var dayOffset, binTime, newDate;
	var out;


	if(dim.type === "date" && d && d !== 0) {
		if(d) {
			match = d.match(re);
		}

		if(match) {
			match = d.match(re);
			dd = parseInt(match[1], 10);
			mm = parseInt(match[2], 10) - 1;
			yy = parseInt(match[3], 10);
			date = new Date(yy, mm, dd);
		}


		if(dim.bin === "week" ) {
			out = undefined;
			if(date !== undefined) {
				dayOffset = date.getDay();
				binTime = date.getTime() - (msInDay * dayOffset) - (6*msInHour); // msInHour required to avoid error on October 1.
				newDate = new Date(binTime);
				out = [newDate.getDate(), (newDate.getMonth() + 1), newDate.getFullYear()].join("-");
			} else {
				onError([d,date].join(","));
			}
		} else if (dim.bin === "year") {
			out = yy;
		}
	} else {
		out = d;
	}

	return out;
}

function forceNumber(val) {
	if(val === null || val === undefined) { return val; }
	if(parseFloat(val) !== val)
	{
		val = val.split(",").join("");
		val = parseFloat(val);
	}
	return val;
}

function getValue(obj, row) {
	var c= obj.c;
	if(c < 0 || obj.f === "#") {
		return null;
	}
	return row[c];
}



function readFile(fileIn, config) {
	var maxLines = config.maxLines || 0,
		onLine = config.onLine || function() {},
		onEnd = config.onEnd || function() {};
		onFirst = config.onFirst;

	var lineIn = new LineReader(fileIn), ended = false, lineCount = 0;


	lineIn.on('line', function(line) {
		if(maxLines > 0 && lineCount === maxLines) {
			lineIn.close();
		} else {
			lineCount++;
			if(lineCount === 1 && onFirst) {
				onFirst(line);
			} else {
				onLine(line, lineCount);
			}
		}
	});
	lineIn.on('end', function() {
		if(!ended) {
			onEnd(lineCount);
		}
		ended = true;
	});

}

// ########################
// Command line facility
// ########################

var argv = process.argv.slice(2);
var help = "\nusage: arguments [options] \n\n" +
            "Parse a csv file,\n" +
            "options:\n" +
            "-h, [-help] # Show this help message and quit\n" +
            "settings:\n" +
            "[fileIn]  # The file to parse\n" +
            "[lineMax] # The maximum number of lines to parse\n";

var tasks = {};
tasks.help = function() { console.log(help); };
tasks.run = run;

if(argv[0] === "-help" || argv[0] === "-h") {
	tasks.help();
} else if(argv[0] && argv[0].split(".")[1]) {
	var fileIn   = argv[0] || "data.csv";
	var maxLines = parseInt(argv[1], 10) || -1;
	tasks.run(fileIn, maxLines);
}
