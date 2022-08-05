from flask import*
from iteration.routes import app_route
app=Flask(
    __name__,
    static_folder="static",
    static_url_path="/static"
)
app.secret_key="any string"

@app.route("/")
def index():
    session["status"]=None
    return render_template("home.html")



app.run(debug=True)