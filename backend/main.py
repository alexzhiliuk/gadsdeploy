from pprint import pprint

from flask import Flask, Response, render_template, request, jsonify
from flask_cors import CORS
from tempfile import NamedTemporaryFile

from campaign import *
from excel import ExcelGoogleAds

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://176.114.89.58/"], supports_credentials=True)


@app.route('/', methods=["OPTIONS", "GET", "POST"])
def index():
    if request.method == "POST":
        try:
            data = request.json
            print(data)
            campaign = Campaign.get_campaign_from_data(data)
            excel_file = ExcelGoogleAds(campaign)
            filename = f"campaign.xlsx"

            with NamedTemporaryFile() as tmp:
                excel_file.wb.save(tmp.name)
                tmp.seek(0)
                stream = tmp.read()

            response = Response(stream, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response.headers['Content-Disposition'] = f'attachment; filename={filename}'
            return response

        except:
            return jsonify({"message": "Произошла ошибка"})

    return render_template('index.html')


def main():
    # ExcelGoogleAds(BASE_DIR / "excel_templates/template.xlsx").wb.save("excel_templates/result.xlsx")
    print(CampaignGroup("test", "test, \"test\", [test]", None).keywords)


if __name__ == "__main__":
    app.run(debug=True)
