<script>
        // 天気情報の英語から日本語への対応表
        const weatherTranslations = {
            "Clear": "快晴",
            "Clouds": "曇り",
            "Drizzle": "霧雨",
            "Rain": "雨",
            "Thunderstorm": "雷雨",
            "Snow": "雪",
            "Mist": "霧",
            // 他の天気情報を追加
        };

        document.addEventListener("DOMContentLoaded", function () {
            const chatLog = document.getElementById("chat-log");
            const userInput = document.getElementById("user-input");
            const sendButton = document.getElementById("send-button");

            // ユーザーのメッセージをChat botに送信する
            sendButton.addEventListener("click", function () {
                const userMessage = userInput.value;
                appendMessage("You: " + userMessage);
                userInput.value = ""; // ユーザーの入力をクリア

                // 天気情報を取得するAPIへのリクエスト
                if (userMessage.includes("天気")) {
                    const city = prompt("都市名を英語で入力してください：");
                    if (city) {
                        fetchWeatherData(city);
                    } else {
                        const botResponse = `おがわBot: 都市名を入力してください。`;
                        appendMessage(botResponse);
                    }
                } else {
                    const botResponse = generateBotResponse(userMessage);
                    appendMessage("おがわBot: " + botResponse);
                }

                 // メッセージを送信した後、入力欄にフォーカスを戻す
                 userInput.focus();
            });

            sendButton.addEventListener("click", sendMessage);


            // チャットログにメッセージを追加する
            function appendMessage(message) {
                const messageDiv = document.createElement("div");
                messageDiv.textContent = message;
                chatLog.appendChild(messageDiv);

                // チャットログを自動スクロール
                chatLog.scrollTop = chatLog.scrollHeight;
            }

            // 天気情報を取得するAPIへのリクエストを送信
            function fetchWeatherData(city) {
                // ここでOpenWeatherMap APIキーを設定
                const apiKey = "f4dc011e417ac7d624fe0afcc916441a";
                const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

                fetch(apiUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        // 5日間の天気予報データを抽出
                        const forecasts = data.list.filter((forecast) => forecast.dt_txt.includes("15:00:00"));

                        // 天気予報を表示
                        displayWeatherForecast(city, forecasts);
                    })
                    .catch((error) => {
                        const botResponse = `おがわBot: 天気情報を取得できませんでした。`;
                        appendMessage(botResponse);
                    });
            }

            // 天気予報を表示
            function displayWeatherForecast(city, forecasts) {
                if (forecasts.length === 0) {
                    const botResponse = `おがわBot: ${city}の天気情報がありません。`;
                    appendMessage(botResponse);
                } else {
                    forecasts.forEach((forecast) => {
                        const date = new Date(forecast.dt * 1000);
                        const dateString = date.toLocaleDateString("ja-JP");
                        const timeString = date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
                        const weatherDescription = forecast.weather[0].main;

                        // 英語から日本語への変換を行う
                        const japaneseWeather = translateToJapanese(weatherDescription);

                        const temperature = (forecast.main.temp - 273.15).toFixed(1) + "℃";

                        const botResponse = `おがわBot: ${dateString} ${timeString}の天気は${japaneseWeather}で、気温は${temperature}です。`;
                        appendMessage(botResponse);
                    });
                }
            }

            // 英語から日本語への変換を行う関数
            function translateToJapanese(englishWeather) {
                if (weatherTranslations.hasOwnProperty(englishWeather)) {
                    return weatherTranslations[englishWeather];
                } else {
                    // 対応がない場合、そのままの英語表記を返す
                    return englishWeather;
                }
            }

            // Enterキーを押してもメッセージを送信する
            userInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault(); // フォームの送信を防ぐ
                    sendButton.click(); // 送信ボタンをプログラム的にクリックすることで送信をトリガ
                }
            });

            // チャットボットの応答を生成
            function generateBotResponse(userMessage) {
                // カスタムコマンドを処理
                if (userMessage.includes("ジョークを教えて")) {
                    return tellAnotherJoke(); // 別のジョークを返す関数を呼び出す
                } else if (userMessage.includes("他には？")) {
                    return tellAnotherJoke(); // ユーザーが「他には？」と尋ねたら別のジョークを返す
                }

                // 挨拶が送信された場合、そのままの挨拶を返す
                const greetings = ["こんにちは", "こんばんは", "おはようございます","おはよう","よろしく"];
                if (greetings.includes(userMessage)) {
                    return userMessage;
                } else {
                    // それ以外の場合、デフォルトの応答を返す
                    return "よろしくお願いします。";
                }
            }

            // 別のジョークをランダムに選んで返す関数
            function tellAnotherJoke() {
                const otherJokes = [
                    "なぜ宇宙人は地球に来ないのか？ 地球は宇宙から見ても危険な惑星だから。",
                    "どうして数学の本が悲しいのか？ たくさんの問題を抱えているから。",
                    "なぜサンタクロースは学校に行かないのですか？サンタはすでに'聖'ニコラスだから学校に行かない！",
                    "なぜバナナは道路を渡るのですか？車がぶどうを轢かないようにするためです！",
                    "ピザがジョークを言うことができるでしょうか？いいえ、ピザはクラストだけを持っています！",
                    "オウムはなぜパーティーに行かないのですか？彼らは常にペリカンと一緒にいます！",
                    "電球がひと言だけ言うとしたら、それは何でしょうか？ 明るくなろうとしています！",
                    "ウサギがカフェで注文した料理は何でしょうか？ウサギトゥール（ウサギ風の料理）です！",
                    "マフィアのベーカリーで一番人気のパンは何でしょうか？シュガー・ローフ！",
                    "ロボットが愛している食べ物は何でしょうか？ボルトカツ！",
                    "バーベキューの招待状があります。なぜですか？それが「焼きました」からです！",
                    // 他のジョークを追加
                ];

                const randomIndex = Math.floor(Math.random() * otherJokes.length);
                return otherJokes[randomIndex];
            }
        });
    </script>
