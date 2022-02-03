"use strict";
// 1行目に記載している 'use strict' は削除しないでください
let masterPartsLists = [];
let updatedPartsLists = [];

// ※※※   Master部品表の読み込み   ※※※
let masterFileInput = document.getElementById("master_csv_file");
let masterMessage = document.getElementById("master_message");
let masterFileReader = new FileReader();

// ファイル変更時イベント
masterFileInput.onchange = () => {
  masterMessage.innerHTML = "読み込み中...";

  let masterFile = masterFileInput.files[0];
  masterFileReader.readAsText(masterFile, "Shift_JIS");
};

// ファイル読み込み時
let items = [];
masterFileReader.onload = () => {
  // ファイル読み込み
  // console.log("masterFileReader.result: ", masterFileReader.result);
  let masterFileArray = parseCSV2(masterFileReader.result, ",");
  // let fileResult = masterFileReader.result.split("\r\n");

  // 先頭行をヘッダとして格納
  let header = masterFileArray[0];
  // let header = fileResult[0].split(",");
  console.log("header: ", header);
  // 先頭行の削除
  masterFileArray.shift();

  // CSVから情報を取得
  const resultArray = [];
  for (const datas of masterFileArray) {
    // console.log("datas: ", datas);
    const result = {};
    for (const index in datas) {
      let key = header[index];
      result[key] = datas[index];
    }
    resultArray.push(result);
  }

  // CSVファイルに無いカラムを追加
  resultArray.map(function addPrice(dataObj) {
    return (dataObj["想定価格"] = dataObj["想定単価"] * dataObj["数量"]);
  });

  masterPartsLists = resultArray;

  // 総計の表示
  const totalCalculated = { totalPrice: 0, totalWeight: 0 };
  resultArray.map(function addPrice(dataObj) {
    totalCalculated["totalPrice"] += parseInt(dataObj["想定価格"]);
    totalCalculated["totalWeight"] += parseInt(dataObj["重量"]);
    return totalCalculated;
  });
  document.getElementById("totalWeight").innerText =
    totalCalculated["totalWeight"] + "g";
  document.getElementById("totalPrice").innerHTML =
    totalCalculated["totalPrice"] + "円";

  // テーブル初期化
  let updatedTbody = document.querySelector("#master-data tbody");
  updatedTbody.innerHTML = "";

  // CSVの内容を表示
  let updatedTbody_html = "";
  for (const item of resultArray) {
    updatedTbody_html += `<tr id="${item["品番"]}">
      <td>${item["No."]}</td>
      <td>${item["品番"]}</td>
      <td>${item["名称"]}</td>
      <td>${item["数量"]}</td>
      <td>${item["担当"]}</td>
      <td>${item["種別"]}</td>
      <td>${item["調達ステータス"]}</td>
      <td>${item["想定単価"]}円</td>
      <td>${item["想定価格"]}円</td>
      <td>${item["重量"]}g</td>
      <td>${item["定義"]}</td>
      <td>${item["改訂"]}</td>
      <td>${item["ﾌﾟﾛﾀﾞｸﾄ記述"]}</td>
    </tr>
    `;
  }
  updatedTbody.innerHTML = updatedTbody_html;
  masterMessage.innerHTML =
    masterFileArray.length + "件のデータを読み込みました。";
};

// ファイル読み取り失敗時
masterFileReader.onerror = () => {
  resultArray = [];
  message.innerHTML = "ファイル読み取りに失敗しました。";
};

// ※※※   更新された部品表の読み込み   ※※※
let fileInput = document.getElementById("csv_file");
let message = document.getElementById("message");
let fileReader = new FileReader();

// ファイル変更時イベント
fileInput.onchange = () => {
  message.innerHTML = "読み込み中...";

  let file = fileInput.files[0];
  fileReader.readAsText(file, "Shift_JIS");
};

// ファイル読み込み時
fileReader.onload = () => {
  // ファイル読み込み
  // console.log("fileReader.result: ", fileReader.result);
  let fileArray = parseCSV2(fileReader.result, ",");
  // let fileResult = fileReader.result.split("\r\n");

  // 先頭行をヘッダとして格納
  let header = fileArray[0];
  // let header = fileResult[0].split(",");
  console.log("header: ", header);
  // 先頭行の削除
  fileArray.shift();

  // CSVから情報を取得
  const resultArray = [];
  for (const datas of fileArray) {
    // console.log("datas: ", datas);
    const result = {};
    for (const index in datas) {
      let key = header[index];
      result[key] = datas[index];
    }
    resultArray.push(result);
  }
  updatedPartsLists = resultArray.filter(
    (partInfo) => partInfo["ﾊﾟｰﾂ番号"] !== "ORIGIN"
  );

  // テーブル初期化
  let updatedTbody = document.querySelector("#updated-data tbody");
  updatedTbody.innerHTML = "";

  // CSVの内容を表示
  let updatedTbody_html = "";
  for (const item of resultArray) {
    updatedTbody_html += `<tr>
        <td>${item["数量"]}</td>
        <td>${item["ﾊﾟｰﾂ番号"]}</td>
        <td>${item["ﾀｲﾌﾟ"]}</td>
        <td>${item["名称"]}</td>
        <td>${item["改訂"]}</td>
        <td>${item["定義"]}</td>
        <td>${item["ﾌﾟﾛﾀﾞｸﾄ記述"]}</td>
        <td>${item["ｿｰｽ"]}</td>
        <td>${item["番号"]}</td>
        <td>${item["ｿｰｽ"]}</td>
        <td>${item["ﾃﾞﾌｫﾙﾄ ﾓﾃﾞﾙ ｿｰｽ"]}</td>
        <td>${item["Name"]}</td>
        <td>${item["Owner"]}</td>
        <td>${item["ｺﾒﾝﾄ"]}</td>
        <td>${item["名前付きURLのﾘｽﾄ"]}</td>
        <td>${item["子"]}</td>
      </tr>
      `;
  }
  updatedTbody.innerHTML = updatedTbody_html;

  message.innerHTML = fileArray.length + "件のデータを読み込みました。";
};

// ファイル読み取り失敗時
fileReader.onerror = () => {
  resultArray = [];
  message.innerHTML = "ファイル読み取りに失敗しました。";
};

// ※ マスター部品表の更新 ※
// https://www.delftstack.com/ja/howto/javascript/javascript-disable-button/
let updateButton = document.getElementById("update-button");
updateButton.disabled = true;
// fileInput.addEventListener("change", stateHandle());
fileInput.addEventListener("change", () => {
  stateHandle();
});
updateButton.addEventListener("click", () => {
  // console.log(console.log("masterPartList: ", masterPartsLists));
  // console.log(console.log("updatedPartsLists: ", updatedPartsLists));

  // 追加された部品をマスター部品表に追加
  let addedParts = extractDataDiff(
    masterPartsLists,
    "品番",
    updatedPartsLists,
    "ﾊﾟｰﾂ番号"
  );
  console.log("addedParts: ", addedParts);

  // テーブル追加
  let updatedTbody = document.querySelector("#master-data tbody");

  // CSVの内容を表示
  let updatedTbody_html = "";
  for (const item of addedParts) {
    updatedTbody_html += `<tr class="add-lists">
      <td>${item["No."]}</td>
      <td>${item["ﾊﾟｰﾂ番号"]}</td>
      <td>${item["名称"]}</td>
      <td>${item["数量"]}</td>
      <td>${item["担当"]}</td>
      <td>${item["種別"]}</td>
      <td>${item["調達ステータス"]}</td>
      <td>${item["想定単価"]}円</td>
      <td>${item["想定価格"]}円</td>
      <td>${item["重量"]}g</td>
      <td>${item["定義"]}</td>
      <td>${item["改訂"]}</td>
      <td>${item["ﾌﾟﾛﾀﾞｸﾄ記述"]}</td>
    </tr>
    `;
  }
  updatedTbody.insertAdjacentHTML("beforeend", updatedTbody_html);

  // 削除された部品をマスター部品表に色付き表示
  let deletedParts = extractDataDiff(
    updatedPartsLists,
    "ﾊﾟｰﾂ番号",
    masterPartsLists,
    "品番"
  );
  console.log("deletedParts: ", deletedParts);

  // テーブル追加
  let deletedTRow = document.getElementById(`${deletedParts[0]["品番"]}`);
  deletedTRow.classList.add("deleted-lists");
  console.log("deletedTRow: ", deletedTRow);

  masterMessage.innerHTML = `${addedParts.length}件の部品情報を読み込みました。<br>${deletedParts.length}件の部品情報が削除されました。`;
});

/* 関数定義 */

// ***  CSVファイルを読み込む関数getCSV()の定義  *****

function getCSV() {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成、サーバと非同期通信するためのAPI
    req.open("get", "sample_master_dv.csv", true); // アクセスするファイルを指定
    req.onload = () => {
      if (req.readyState === 4 && req.status === 0) {
        resolve(convertCSVtoArray(req.responseText));
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = () => {
      reject(new Error(req.statusText));
    };
    req.send(null); // HTTPリクエストの発行
  });
}

// ***  CSV形式のtextを2次元配列に変換する関数parseCSV2()の定義  *****
// http://liosk.blog103.fc2.com/blog-entry-75.html
// http://memo.lovechu.net/2012/04/10-202257.php
// 第一引数には解釈するCSVテキストを渡し、
// 第二引数ではfield間の区切り文字を指定する。
// デフォルトはコンマ(,)。
// 戻り値は、CSVを解釈した2次元配列
function parseCSV2(text, delim) {
  if (!delim) delim = ",";
  var tokenizer = new RegExp(
    delim + "|\r?\n|[^" + delim + '"\r\n][^' + delim + '\r\n]*|"(?:[^"]|"")*"',
    "g"
  );

  var record = 0,
    field = 0,
    data = [[""]],
    qq = /""/g;
  text.replace(/\r?\n$/, "").replace(tokenizer, function (token) {
    switch (token) {
      case delim:
        data[record][++field] = "";
        break;
      case "\n":
      case "\r\n":
        data[++record] = [""];
        field = 0;
        break;
      default:
        data[record][field] =
          token.charAt(0) != '"' ? token : token.slice(1, -1).replace(qq, '"');
    }
  });

  return data;
}

/**
 * 更新ボタンの有効／無効を切り替える関数
 * @param
 * @returns
 */
function stateHandle() {
  if (document.querySelector("#csv_file").value === "") {
    updateButton.disabled = true;
    console.log("updateButton.disabled = true;");
  } else {
    updateButton.disabled = false;
    console.log("updateButton.disabled = false;");
  }
}

/**
 * ２つのオブジェクト配列と、ユニークIDとなるKeyを引数にとり、第１引数に含まれないKeyの値の配列を返す。
 * @param ary1 [Array]
 * @param uniqueKey1 [string]
 * @param ary2 [Array]
 * @param uniqueKey2 [string]
 * @returns [Array] ary2の要素オブジェクトにおけるuniqueKey2の値と、
 *                  ary1の要素オブジェクトにおけるuniqueKey1の値とを比較し、
 *                  ary2にあってary1に無いオブジェクトの配列を返す。
 */
function extractDataDiff(ary1, uniqueKey1, ary2, uniqueKey2) {
  const resultArray = ary2.filter((ary2Obj) => {
    for (const ary1Obj of ary1) {
      if (ary1Obj[uniqueKey1] === ary2Obj[uniqueKey2]) {
        return false;
      }
    }
    return true;
  });
  return resultArray;
}

// テストコード
// const test1 = [
//   { key1: "a", key2: "b" },
//   { key1: "c", key2: "d" },
// ];
// const test2 = [
//   { key1: "a", key2: "B" },
//   { key1: "e", key2: "f" },
// ];
// console.log(extractDataDiff(test1, test2, "key1"));
