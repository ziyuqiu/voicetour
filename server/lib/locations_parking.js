locations_parking = [
	gymp1 = {
		"name":"Athletics lot",
		"nickname":"Athletics lot",
		"coordinates":[
			new Point(42.365088,-71.256173), 
			new Point(42.364914,-71.256057), 
			new Point(42.364422,-71.257879), 
			new Point(42.364272,-71.257766)],
		"category":["parking"],
		"entrances":["athleticslot_e01"]
	},
	gymp2 = {
		"name":"Gosman parking lot",
		"nickname":"Gosman parking lot ",
		"coordinates":[
			new Point(42.365056,-71.253832), 
			new Point(42.364858,-71.253718), 
			new Point(42.365541,-71.252837), 
			new Point(42.365393,-71.252676)],
		"category":["parking"],
		"entrances":["gosmanparkinglot_e01","gosmanparkinglot_e02"]
	},
	gymp3 = {
		"name":"Linsey parking lot",
		"nickname":"Linsey parking lot ",
		"coordinates":[
			new Point(42.365568,-71.254114), 
			new Point(42.365449,-71.253988), 
			new Point(42.365645,-71.253642), 
			new Point(42.365739,-71.253857)],
		"category":["parking"],
		"entrances":["linseyparkinglot_e01"]
	},
]
function Point(x,y) {
	this.x = x;
	this.y = y;
}