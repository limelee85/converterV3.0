// Init

let selcode=0;
$( function() {

	// create selectmenu 
    $( "#code" ).selectmenu({
    	change: function( event, data ) {
    		change_code(data.item.value);
    		additional_options();
       }
     })
    .selectmenu( "option", "width", "auto" );
 
    $( "#mode" ).selectmenu({
    	change: function( event, data ) {

    		additional_options();

    		if (selcode != 5) {
    			reqenc(selcode);
    		}
    		else {
    			reqjs();
    		}
       }
     })
    .selectmenu( "option", "width", "auto" )
    .selectmenu("menuWidget")
    .addClass("overflow");
 
    $( "#charset" ).selectmenu({
    	change: function( event, data ) {
    		reqenc(selcode);
       }
     })
    .selectmenu( "option", "width", "auto" )
      .selectmenu( "menuWidget" )
      .addClass( "overflow" );
 
 		$( ".sort-option" ).checkboxradio().on( "change", function( event, ui ) {
 			reqjs();
 		} );

 		$( ".uniq-option" ).checkboxradio().on( "change", function( event, ui ) {
 			reqjs();
 		} );

    $('#hashing').css('display', 'none');
    $('#options_sort').css('display', 'none');
    $('#options_uniq').css('display', 'none');
    change_code("0");

    // event handler bind
    $("#swap").on("click", function(event) { swap(); });
    $("#Encode").on("input", function(event) { reqenc(0); });
    $("#Decode").on("input", function(event) { reqenc(1); });
    $("#Plain").on("input", function(event) { reqenc(2); });
    $("#Text").on("input", function(event) { reqenc(3); });
    $("#Encrypted").on("input", function(event) { reqenc(4); });
    $("#Input").on("input", function(event) { reqjs(); });

} );

// ### Options ###
// Code Event
// 0 en/decode 1 hashing 2 en/decryption
function change_code(code) {

	// input/ output display event
	$('#endecode').css('display', 'none');
	$('#hashing').css('display', 'none');
	$('#endecrypt').css('display', 'none');
	$('#translator').css('display', 'none');
	$("select[name='mode'] option").remove();

	// setting data
	switch(code) {
		case "0":
			selcode = 0;
			$('#endecode').css('display', 'block');
			option_data = {"":{"url":"URL","b64":"Base64","hex":"Hex"}}
			break
		case "1":
			selcode = 2;
			$('#hashing').css('display', 'block');
			option_data = {"자주 쓰는 메뉴":{"md5":"md5","sha256":"sha256","sha512":"sha512"},"전체 메뉴":{"md2":"md2","md4":"md4","sha1":"sha1","sha224":"sha224","sha384":"sha384","sha512/224":"sha512/224","sha3-224":"sha3-224","sha512/256":"sha512/256","sha3-256":"sha3-256","sha3-384":"sha3-384","sha3-512":"sha3-512","ripemd128":"ripemd128","ripemd160":"ripemd160","ripemd256":"ripemd256","ripemd320":"ripemd320","whirlpool":"whirlpool","tiger128,3":"tiger128,3","tiger160,3":"tiger160,3","tiger192,3":"tiger192,3","haval224,3":"haval224,3","haval128,5":"haval128,5","haval160,5":"haval160,5","haval192,5":"haval192,5","haval224,5":"haval224,5","haval256,5":"haval256,5"}}
			break	
		case "2":
			selcode = 3;
			$('#endecrypt').css('display', 'block');
			option_data = {"AES":{"aes-128-cbc":"AES-128-CBC","aes-192-cbc":"AES-192-CBC","aes-256-cbc":"AES-256-CBC"},"DES":{"des-ede-cbc":"DES-EDE-CBC","des-ede-ecb":"DES-EDE-EBC","des-ede3":"3DES","des-ede3-cbc":"3DES-CBC"},"ARIA":{"aria-128-cbc":"ARIA-128-CBC","aria-192-cbc":"ARIA-192-CBC","aria-256-cbc":"ARIA-256-CBC"},"CAMELLIA":{"camellia-128-cbc":"CAMELLIA-128-CBC","camellia-192-cbc":"CAMELLIA-192-CBC","camellia-256-cbc":"CAMELLIA-256-CBC"}};
			break
		case "3":
			selcode = 5;
			$('#translator').css('display', 'block');
			option_data = {"":{"reverse":"Reverse","rot13":"ROT13","sort":"Sort","uniq":'Unique',"Eng2Han":"Eng2Han","Han2Eng":"Han2Eng"}};
			break
	}

	// change mode option event
	let option_text = "";
	for (const i in option_data ) {
		option_text += `<optgroup label="${i}">`;
		const property = option_data[i];
		for (const j in property) {
			option_text += `<option value="${j}">${property[j]}</option>`;
		}
		option_text += "</optgroup>";
	}

	$("#mode").append(option_text);
	$( "#mode" ).selectmenu("refresh");
}

function swap() {
	switch(selcode) {
		case 0:
			$("#Encode").val($("#Decode").val());
			reqenc(selcode);
			break
		case 2:
			$("#Plain").val($("#Hash").val());
			reqenc(selcode);
			break
		case 3:
			$("#Text").val($("#Encrypted").val());
			reqenc(selcode)
			break
		case 5:
			$("#Input").val($("#Output").val());
			reqjs()
			break
	}
}

function additional_options() {
	$('#options_sort').css('display', 'none');
  $('#options_uniq').css('display', 'none');
  if ($("#mode").val() == "sort") {
  	$('#options_sort').css('display', 'block');
  }
  else if ($("#mode").val() == "uniq") {
  	$('#options_uniq').css('display', 'block');
  }
}

// ### Options End ###

// ### Request and Response ###

function getresult(formData) {
	let temp;
	//console.log(formData);
	$.ajax({
		url:"/enc.php",
		type:"POST",
		data:encodeURI(formData),
		async: false,
		success:function(data) {
			temp = data;
		},
		error: function(xhr,status) {
			console.log(xhr + ":" + status);
		}
	});

	return temp;
}

function reqenc(code) {
	console.log(code);
	let val;
	switch(code) {
		case 0:
			val = $("#Encode").val();
			break
		case 1:
			val = encodeURIComponent($("#Decode").val());
			break
		case 2:
			val = $("#Plain").val();
			break
		case 3:
			val = $("#Text").val();
			val = val + "&key=" + $("#Key").val() +"&IV=" + $("#IV").val();
			console.log(val);
			break
		case 4:
			val = encodeURIComponent($("#Encrypted").val());
			val = val + "&key=" + $("#Key").val() +"&IV=" + $("#IV").val();
			break
	}
	const formData = $("#test").serialize()+"&code="+code+"&data="+val;
	const result = getresult(formData);
	switch(code) {
		case 0:
			$("#Decode").val(result);
			break
		case 1:
			$("#Encode").val(result);
			break
		case 2:
			$("#Hash").val(result);
			break
		case 3:
			val = $("#Encrypted").val(result);
			break
		case 4:
			val = $("#Text").val(result);
			break
	}


}

function reqjs() {
	result = window[$("#mode").val()]();

	$("#Output").val(result);
}

// ### Request and Response End ###

// ### reqjs ### 

function reverse() {
	let result = ''
	const array = $("#Input").val();
	for ( i of array ) {
	result = i + result;
	}

	return result;
}

function rot13() {
	let result = ''
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const array = $("#Input").val();
	for ( i in alphabet ) {
		result += "ROT["+i+"] => "
		for ( j of array ) {
			if (alphabet.indexOf(j.toLowerCase()) != -1 && alphabet.indexOf(j) != -1 ) {
				result += alphabet[(alphabet.indexOf(j)+parseInt(i))%26];
			}
			else if (alphabet.indexOf(j.toLowerCase()) != -1){
				result += alphabet[(alphabet.indexOf(j.toLowerCase())+parseInt(i))%26].toUpperCase();
			}
			else {
				result += j;
			}
		}
		result += "\n"
	}

	return result;
}

function sort() {
	let array=$("#Input").val().split('\n');
	if ($("#sort-rm-space").is(":checked")) {
		array = array.map(element => {
			return element.trim();
		});
	}
	
	if ($("#sort-ignore-case").is(":checked")) {
		array.sort((a,b) => a.localeCompare(b));	
	}
	else {
		array.sort();
	}

	if ($("#sort-desc").is(":checked")) {
		array.reverse();
	}
	

	const result = array.join('\n');
	return result;
	}

function uniq() {
	let array=$("#Input").val().split('\n');

	if ($("#uniq-rm-space").is(":checked")) {
		array = array.map(element => {
			return element.trim();
		});
	}

	if ($("#uniq-ignore-case").is(":checked")) {
		array = Array.from(new Map(array.map(element => [element.toLowerCase(), element])).values());
	}
	else {
		array = Array.from(new Set(array));
	}
	
	const result = array.join('\n');
	return result;
}

const cho = ['g', 'v', 'x', 'z', 'c', 'W', 'w', 'd', 'T', 't', 'Q', 'q', 'a', 'f', 'E', 'e', 's', 'R', 'r'];
const cho_kor = ['ㅎ', 'ㅍ', 'ㅌ', 'ㅋ', 'ㅊ', 'ㅉ', 'ㅈ', 'ㅇ', 'ㅆ', 'ㅅ', 'ㅃ', 'ㅂ', 'ㅁ', 'ㄹ', 'ㄸ', 'ㄷ', 'ㄴ', 'ㄲ', 'ㄱ'];
const jung = ['l', 'ml', 'm', 'b', 'nl', 'np', 'nj', 'n', 'y', 'hl', 'ho', 'hk', 'h', 'P', 'u', 'p', 'j', 'O', 'i', 'o', 'k'];
const jung_kor = ['ㅣ', 'ㅢ', 'ㅡ', 'ㅠ', 'ㅟ', 'ㅞ', 'ㅝ', 'ㅜ', 'ㅛ', 'ㅚ', 'ㅙ', 'ㅘ', 'ㅗ', 'ㅖ', 'ㅕ', 'ㅔ', 'ㅓ', 'ㅒ', 'ㅑ', 'ㅐ', 'ㅏ'];
const jong = ['g', 'v', 'x', 'z', 'c', 'w', 'd', 'T', 't', 'qt', 'q', 'a', 'fg', 'fv', 'fx', 'ft', 'fq', 'fa', 'fr', 'f', 'e', 'sg', 'sw', 's', 'rt', 'R', 'r'];
const jong_kor = ['ㅎ', 'ㅍ', 'ㅌ', 'ㅋ', 'ㅊ', 'ㅈ', 'ㅇ', 'ㅆ', 'ㅅ', 'ㅄ', 'ㅂ', 'ㅁ', 'ㅀ', 'ㄿ', 'ㄾ', 'ㄽ', 'ㄼ', 'ㄻ', 'ㄺ', 'ㄹ', 'ㄷ', 'ㄶ', 'ㄵ', 'ㄴ', 'ㄳ', 'ㄲ', 'ㄱ'];

function E2H(cho, jung, jong) {
	console.log(cho,jung,jong);
	return String.fromCharCode(44032 + cho * 21 * 28 + jung * 28 + jong + 1);
}

function findIndex(i,c,l=0) {
	return c.find((element) => i.substr(l).indexOf(element) == 0) ?? '';
}

function Eng2Han() {

	let input=$("#Input").val();
	let result = '';
	let ischo,isjung,isjong,isnotjong = '';

	while (input != '' ) {
		ischo = findIndex(input,cho);
		if ( ischo != '' ) {
			isjung = findIndex(input,jung,ischo.length); 
			if ( isjung != '' ) {
				isjong = findIndex(input,jong,ischo.length + isjung.length); 
				if ( isjong != '' ) {
					isnotjong = findIndex(input,jung,ischo.length + isjung.length + isjong.length); 
					if ( isnotjong != '' ) {
						isjong = jong.find((element) => input.substr(isjung.length + ischo.length + isjong.length -2 , 1).indexOf(element) == 0) ?? '' ;
						result += E2H(cho.length-1-cho.indexOf(ischo),jung.length-1-jung.indexOf(isjung),((jong.length-jong.indexOf(isjong))%28)-1);
						input = input.substr(isjong.length + isjung.length + ischo.length);
					}
					else {
						result += E2H(cho.length-1-cho.indexOf(ischo),jung.length-1-jung.indexOf(isjung),(jong.length-jong.indexOf(isjong))-1);
						input = input.substr(isjong.length + isjung.length + ischo.length);
					}
				}
				else {
					result += E2H(cho.length-1-cho.indexOf(ischo),jung.length-1-jung.indexOf(isjung),-1);
					input = input.substr(isjong.length + isjung.length + ischo.length);
				}
			}
			else {
				isjong = findIndex(input,jong,0); 
				if ( isjong != '' ) {
					isnotjong = findIndex(input,jung,isjong.length);
					if ( isnotjong != '' ) {
						isjong = jong.find((element) => input.substr(isjong.length -2 , 1).indexOf(element) == 0) ?? '' ;
						result += jong_kor[jong.indexOf(isjong)];
						input = input.substr(isjong.length);
					}
					else {
						result += jong_kor[jong.indexOf(isjong)];
						input = input.substr(isjong.length);
					}
				}
				else {
					result += cho_kor[cho.indexOf(ischo)]; 
					input = input.substr(isjong.length);
				}
			}
		}
		else {
			isjung = findIndex(input,jung,ischo.length);
			if ( isjung != '' ) {
				result += jung_kor[jung.indexOf(isjung)];
				input = input.substr(isjung.length);
			}
			else {
				result +=  input.substr(0,1);
				input = input.substr(1);
			}
			
		}
	}
	return result;
}


function Han2Eng() {

	let input=$("#Input").val();
	let result = "";
	let index = "-1";

	let temp = new Set(cho.concat(jung).concat(jong));
	const chojungjong = [...temp];
	temp = new Set(cho_kor.concat(jung_kor).concat(jong_kor));
	const chojungjong_kor = [...temp];
	

	while (input != '') {
		
		if ( 44032 <= input.charCodeAt(0) && input.charCodeAt(0) <= 55203 ) {
			var code = input.charCodeAt(0) - 44032;
			
			index = Math.floor(code / (21 * 28));
			if ( index !== -1 )  {
				result += cho[18-index];
			}
			index = Math.floor(code / 28) % 21;
			if ( index !== -1 ) {
				result += jung[20-index];
			}

			index = code % 28 - 1;
			if ( index !== -1 ) {
				result += jong[26-index];
			}

		}

		else {
			result += chojungjong[chojungjong_kor.indexOf(input.substr(0,1))] ?? input.substr(0,1);
		}

		input = input.substr(1);
		
	}
	return result;
}

// ### reqjs END ### 
