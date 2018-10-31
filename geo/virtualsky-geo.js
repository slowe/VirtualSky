function geoIP(){

	// ISO 3166 country code conversion
	var cc = {'AD':'Andorra','AE':'United Arab Emirates','AF':'Afghanistan','AG':'Antigua and Barbuda','AI':'Anguilla','AL':'Albania','AM':'Armenia','AO':'Angola','AQ':'Antarctica','AR':'Argentina','AS':'American Samoa','AT':'Austria','AU':'Australia','AW':'Aruba','AX':'Åland Islands','AZ':'Azerbaijan','BA':'Bosnia and Herzegovina','BB':'Barbados','BD':'Bangladesh','BE':'Belgium','BF':'Burkina Faso','BG':'Bulgaria','BH':'Bahrain','BI':'Burundi','BJ':'Benin','BL':'Saint Barthélemy','BM':'Bermuda','BN':'Brunei Darussalam','BO':'Bolivia','BQ':'Bonaire, Sint Eustatius and Saba','BR':'Brazil','BS':'Bahamas','BT':'Bhutan','BV':'Bouvet Island','BW':'Botswana','BY':'Belarus','BZ':'Belize','CA':'Canada','CC':'Cocos (Keeling) Islands','CD':'Congo, the Democratic Republic of the','CF':'Central African Republic','CG':'Congo','CH':'Switzerland','CI':'Côte d\'Ivoire','CK':'Cook Islands','CL':'Chile','CM':'Cameroon','CN':'China','CO':'Colombia','CR':'Costa Rica','CU':'Cuba','CV':'Cabo Verde','CW':'Curaçao','CX':'Christmas Island','CY':'Cyprus','CZ':'Czech Republic','DE':'Germany','DJ':'Djibouti','DK':'Denmark','DM':'Dominica','DO':'Dominican Republic','DZ':'Algeria','EC':'Ecuador','EE':'Estonia','EG':'Egypt','EH':'Western Sahara','ER':'Eritrea','ES':'Spain','ET':'Ethiopia','FI':'Finland','FJ':'Fiji','FK':'Falkland Islands (Malvinas)','FM':'Micronesia, Federated States of','FO':'Faroe Islands','FR':'France','GA':'Gabon','GB':'UK','GD':'Grenada','GE':'Georgia','GF':'French Guiana','GG':'Guernsey','GH':'Ghana','GI':'Gibraltar','GL':'Greenland','GM':'Gambia','GN':'Guinea','GP':'Guadeloupe','GQ':'Equatorial Guinea','GR':'Greece','GS':'South Georgia and the South Sandwich Islands','GT':'Guatemala','GU':'Guam','GW':'Guinea-Bissau','GY':'Guyana','HK':'Hong Kong','HM':'Heard Island and McDonald Islands','HN':'Honduras','HR':'Croatia','HT':'Haiti','HU':'Hungary','ID':'Indonesia','IE':'Ireland','IL':'Israel','IM':'Isle of Man','IN':'India','IO':'British Indian Ocean Territory','IQ':'Iraq','IR':'Iran, Islamic Republic of','IS':'Iceland','IT':'Italy','JE':'Jersey','JM':'Jamaica','JO':'Jordan','JP':'Japan','KE':'Kenya','KG':'Kyrgyzstan','KH':'Cambodia','KI':'Kiribati','KM':'Comoros','KN':'Saint Kitts and Nevis','KP':'Korea, Democratic People\'s Republic of','KR':'Korea, Republic of','KW':'Kuwait','KY':'Cayman Islands','KZ':'Kazakhstan','LA':'Lao People\'s Democratic Republic','LB':'Lebanon','LC':'Saint Lucia','LI':'Liechtenstein','LK':'Sri Lanka','LR':'Liberia','LS':'Lesotho','LT':'Lithuania','LU':'Luxembourg','LV':'Latvia','LY':'Libya','MA':'Morocco','MC':'Monaco','MD':'Moldova, Republic of','ME':'Montenegro','MF':'Saint Martin (French part)','MG':'Madagascar','MH':'Marshall Islands','MK':'Macedonia, the former Yugoslav Republic of','ML':'Mali','MM':'Myanmar','MN':'Mongolia','MO':'Macao','MP':'Northern Mariana Islands','MQ':'Martinique','MR':'Mauritania','MS':'Montserrat','MT':'Malta','MU':'Mauritius','MV':'Maldives','MW':'Malawi','MX':'Mexico','MY':'Malaysia','MZ':'Mozambique','NA':'Namibia','NC':'New Caledonia','NE':'Niger','NF':'Norfolk Island','NG':'Nigeria','NI':'Nicaragua','NL':'Netherlands','NO':'Norway','NP':'Nepal','NR':'Nauru','NU':'Niue','NZ':'New Zealand','OM':'Oman','PA':'Panama','PE':'Peru','PF':'French Polynesia','PG':'Papua New Guinea','PH':'Philippines','PK':'Pakistan','PL':'Poland','PM':'Saint Pierre and Miquelon','PN':'Pitcairn','PR':'Puerto Rico','PS':'Palestine, State of','PT':'Portugal','PW':'Palau','PY':'Paraguay','QA':'Qatar','RE':'Réunion','RO':'Romania','RS':'Serbia','RU':'Russian Federation','RW':'Rwanda','SA':'Saudi Arabia','SB':'Solomon Islands','SC':'Seychelles','SD':'Sudan','SE':'Sweden','SG':'Singapore','SH':'Saint Helena, Ascension and Tristan da Cunha','SI':'Slovenia','SJ':'Svalbard and Jan Mayen','SK':'Slovakia','SL':'Sierra Leone','SM':'San Marino','SN':'Senegal','SO':'Somalia','SR':'Suriname','SS':'South Sudan','ST':'Sao Tome and Principe','SV':'El Salvador','SX':'Sint Maarten','SY':'Syrian Arab Republic','SZ':'Swaziland','TC':'Turks and Caicos Islands','TD':'Chad','TF':'French Southern Territories','TG':'Togo','TH':'Thailand','TJ':'Tajikistan','TK':'Tokelau','TL':'Timor-Leste','TM':'Turkmenistan','TN':'Tunisia','TO':'Tonga','TR':'Turkey','TT':'Trinidad and Tobago','TV':'Tuvalu','TW':'Taiwan, Province of China','TZ':'Tanzania','UA':'Ukraine','UG':'Uganda','UM':'US Minor Outlying Islands','US':'USA','UY':'Uruguay','UZ':'Uzbekistan','VA':'Holy See','VC':'Saint Vincent and the Grenadines','VE':'Venezuela','VG':'British Virgin Islands','VI':'Virgin Islands, U.S.','VN':'Viet Nam','VU':'Vanuatu','WF':'Wallis and Futuna','WS':'Samoa','YE':'Yemen','YT':'Mayotte','ZA':'South Africa','ZM':'Zambia','ZW':'Zimbabwe'};

	var db = new Array();
	var ids = {};
	var loaded = {};
	var dir = "";
	var _obj = this;
	if(!this.geoname) this.geoname = { 'created': false };
	
	if(!this.geoname.created){
		S('head').append('<style type="text/css">'+
			'#'+this.id+'_location { width: 100%; box-sizing: border-box; } '+
			'#'+this.id+'_searchresults ol { list-style: none; padding-left: 0px; text-align: left; margin: 0px; border: 1px solid rgba(0,0,0,0.1); border-top: 0px; } '+
			'#'+this.id+'_searchresults li { cursor: pointer; } '+
			'#'+this.id+'_searchresults li a { padding: 0.5em; display: block; color: inherit; } '+
			'#'+this.id+'_searchresults li.selected { background-color: rgba(255,255,255,0.85); } '+
			'</style>');
		this.geoname.created = true;
	}

	if(S('#'+this.id+'_geoname').length == 0){
		var eg = "e.g. Cardiff, UK";
		S('#'+this.id+'_geo').append('<div style="text-align:center;margin-top:4px;"><form id="'+this.id+'_geoname" onsubmit="return false;"><input id="'+this.id+'_location" value="'+eg+'"><!-- <input id="'+this.id+'_geoname_btn" type="submit" value="Search" />--><br /><span id="'+this.id+'_geoname_message"><\/span><div id="'+this.id+'_searchresults"><\/div><\/form><\/div>');
		this.lightbox.resize();
		// Store current state of the keyboard variable
		// When we're in the input field, we don't want to change the sky
		S('#'+this.id+'_location').on('focus',{sky:this},function(e){
			e.data.sky.keyboard = false;
			if(S('#'+e.data.sky.id+'_location').val() == eg) S('#'+e.data.sky.id+'_location')[0].value = '';
		}).on('blur',{sky:this,key:this.keyboard},function(e){
			e.data.sky.keyboard = e.data.key;
			if(!S('#'+e.data.sky.id+'_location').val()){
				S('#'+e.data.sky.id+'_location')[0].value = eg;
				S('#'+e.data.sky.id+'_geoname_message').html('');
				e.data.sky.createLightbox(S('#'+e.data.sky.id+'_geo'));
			}
		}).on('keyup',{sky:this},function(e){
			e.preventDefault();
			if(e.originalEvent.keyCode==40 || e.originalEvent.keyCode==38){
				// Down=40
				// Up=38
				var li = S('#'+e.data.sky.id+'_searchresults li');
				var s = -1;
				for(var i = 0; i < li.e.length; i++){
					if(S(li.e[i]).hasClass('selected')) s = i;
				}
				if(e.originalEvent.keyCode==40) s++;
				else s--;
				if(s < 0) s = li.e.length-1;
				if(s >= li.e.length) s = 0;
				S('#'+e.data.sky.id+'_searchresults .selected').removeClass('selected');
				S(li.e[s]).addClass('selected');
			}else if(e.originalEvent.keyCode==13){
				selectName(S('#'+e.data.sky.id+'_searchresults .selected'))
			}else{
				// Need to load the data file for the first letter
				var name = this.e[0].value.toLowerCase();
				name = toPlainASCII(name);
				var fl = name[0];
				if(fl && fl.match(/[a-zA-Z\'\`]/i)){
					if(!loaded[fl]){
						dir = _obj.getDir('virtualsky-geo');
						S(document).ajax(dir+'ranked-'+fl+'.tsv',{
							'success': function(data){
								var line,i;
								if(typeof data==="string") data = data.replace(/\r/,'').split(/[\n]/);
								for(i = 0; i < data.length; i++){
									line = data[i].split(/\t/);
									if(line[0] && typeof ids[line[0]]==="undefined"){
										db.push({'id':fl+'-'+i,'i':i,'file':dir+'cities/'+fl+'-'+(Math.floor(i/100))+'.tsv','truename':line[0],'name':(line[1] ? line[1] : line[0]),'cc':line[2],'admin1':line[3],'n':parseInt(line[4])});
										ids[fl+'-'+i] = db.length-1;
									}
								}
								processResult(name);
							},
							'error': function(e){ console.log(e); }
						});
						loaded[fl] = true;
					}else processResult(name);
				}else processResult('');
			}
		});
	}

	// Select one of the people in the drop down list
	function selectName(selected){
		// Get the ID from the DOM element's data-id attribute
		// Use that to find the index that corresponds to in the "db" hash
		var id = ids[selected.attr('data-id')];
		S().ajax(db[id].file,{
			'this': this,
			'success': function(data){
				data = data.replace(/\r/,'').split(/[\n]/);
				var lat,lon,i;
				var sky = _obj;
				for(i = 0; i < data.length; i++){
					line = data[i].split(/\t/);
					if(line[0] == db[id].i){
						lat = parseFloat(line[1]);
						lon = parseFloat(line[2]);
						i = data.length;
					}
				}
				sky.setGeo(lat+','+lon);
				S('#'+sky.id+'_lat').val(lat);
				S('#'+sky.id+'_long').val(lon);
				sky.draw();
				sky.setClock(0);
				// Zap search results
				S('#'+sky.id+'_searchresults').html('');
				//S('#'+sky.id+'_location')[0].blur();
				S('#'+sky.id+'_location')[0].value = selected.find('a').html();
			},
			'error': function(e){ console.log(e); }
		});

	}

	function processResult(name){
		var html = "";
		var tmp = new Array();
		var li = S('#'+_obj.id+'_searchresults li');
		for(var i = 0 ; i < li.e.length ; i++) S(li.e[i]).off('click');
		name = name.toLowerCase();
		if(name.length >= 1){
			var names = name.split(/ /);
			var n = names.length;
			var mx = 0;
			for(var i = 0; i < db.length; i++){
				if(db[i].n > mx) mx = db[i].n;
				db[i].rank = 0;
			}
			for(var i = 0; i < db.length; i++){
				rank = 0;
				for(m = 0; m < n ; m++){
					if(db[i].name.toLowerCase().indexOf(names[m]) >= 0) rank++;
					else{
						if(db[i].truename.toLowerCase().indexOf(names[m]) >= 0) rank++;
						else rank--;
					}
				}
				if(rank > 0){
					datum = db[i];
					datum.rank = rank*db[i].n/mx;
					tmp.push(datum);
				}
			}
			tmp = sortBy(tmp,'rank');
			if(tmp.length > 0){
				S('#'+_obj.id+'_searchresults li').off('click');
				html = "<ol>";
				var n = Math.min(tmp.length,8);
				for(var i = 0; i < n; i++) html += '<li data-id="'+tmp[i].id+'" '+(i==0 ? ' class="selected"':'')+'><a href="#'+i+'" class="name">'+tmp[i].truename+(tmp[i].cc=="US" ? ', '+tmp[i]['admin1']+'':'')+(tmp[i].cc && cc[tmp[i].cc] ? ', '+cc[tmp[i].cc]+'' : "")+"</a></li>";
				html += "</ol>";
			}
		}
		S('#'+_obj.id+'_searchresults').html(html);
		var li = S('#'+_obj.id+'_searchresults li a');
		for(var i = 0 ; i < li.e.length ; i++) S(li.e[i]).on('click',function(e){ e.preventDefault(); selectName(this.parent()); });
	}

	// Sort the data
	function sortBy(arr,i){
		yaxis = i;
		return arr.sort(function (a, b) {
			return a[i] < b[i] ? 1 : -1;
		});
	}
	
	// 
	function toPlainASCII(str){
	
		var map = [
			{'b':'A', 'l':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
			{'b':'AA','l':/[\uA732]/g},
			{'b':'AE','l':/[\u00C6\u01FC\u01E2]/g},
			{'b':'AO','l':/[\uA734]/g},
			{'b':'AU','l':/[\uA736]/g},
			{'b':'AV','l':/[\uA738\uA73A]/g},
			{'b':'AY','l':/[\uA73C]/g},
			{'b':'B', 'l':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
			{'b':'C', 'l':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
			{'b':'D', 'l':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
			{'b':'DZ','l':/[\u01F1\u01C4]/g},
			{'b':'Dz','l':/[\u01F2\u01C5]/g},
			{'b':'E', 'l':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
			{'b':'F', 'l':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
			{'b':'G', 'l':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
			{'b':'H', 'l':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
			{'b':'I', 'l':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
			{'b':'J', 'l':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
			{'b':'K', 'l':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
			{'b':'L', 'l':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
			{'b':'LJ','l':/[\u01C7]/g},
			{'b':'Lj','l':/[\u01C8]/g},
			{'b':'M', 'l':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
			{'b':'N', 'l':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
			{'b':'NJ','l':/[\u01CA]/g},
			{'b':'Nj','l':/[\u01CB]/g},
			{'b':'O', 'l':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
			{'b':'OI','l':/[\u01A2]/g},
			{'b':'OO','l':/[\uA74E]/g},
			{'b':'OU','l':/[\u0222]/g},
			{'b':'P', 'l':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
			{'b':'Q', 'l':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
			{'b':'R', 'l':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
			{'b':'S', 'l':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
			{'b':'T', 'l':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
			{'b':'TZ','l':/[\uA728]/g},
			{'b':'U', 'l':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
			{'b':'V', 'l':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
			{'b':'VY','l':/[\uA760]/g},
			{'b':'W', 'l':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
			{'b':'X', 'l':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
			{'b':'Y', 'l':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
			{'b':'Z', 'l':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
			{'b':'a', 'l':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
			{'b':'aa','l':/[\uA733]/g},
			{'b':'ae','l':/[\u00E6\u01FD\u01E3]/g},
			{'b':'ao','l':/[\uA735]/g},
			{'b':'au','l':/[\uA737]/g},
			{'b':'av','l':/[\uA739\uA73B]/g},
			{'b':'ay','l':/[\uA73D]/g},
			{'b':'b', 'l':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
			{'b':'c', 'l':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
			{'b':'d', 'l':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
			{'b':'dz','l':/[\u01F3\u01C6]/g},
			{'b':'e', 'l':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
			{'b':'f', 'l':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
			{'b':'g', 'l':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
			{'b':'h', 'l':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
			{'b':'hv','l':/[\u0195]/g},
			{'b':'i', 'l':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
			{'b':'j', 'l':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
			{'b':'k', 'l':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
			{'b':'l', 'l':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
			{'b':'lj','l':/[\u01C9]/g},
			{'b':'m', 'l':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
			{'b':'n', 'l':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
			{'b':'nj','l':/[\u01CC]/g},
			{'b':'o', 'l':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
			{'b':'oi','l':/[\u01A3]/g},
			{'b':'ou','l':/[\u0223]/g},
			{'b':'oo','l':/[\uA74F]/g},
			{'b':'p','l':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
			{'b':'q','l':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
			{'b':'r','l':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
			{'b':'s','l':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
			{'b':'t','l':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
			{'b':'tz','l':/[\uA729]/g},
			{'b':'u','l':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
			{'b':'v','l':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
			{'b':'vy','l':/[\uA761]/g},
			{'b':'w','l':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
			{'b':'x','l':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
			{'b':'y','l':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
			{'b':'z','l':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
		];

		for(var i = 0; i < map.length; i++) str = str.replace(map[i].l, map[i].b);

		return str;
	}
}
