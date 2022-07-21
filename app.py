from flask import Flask,Blueprint
from iteration.routes import app_route
app=Flask(__name__)


app.register_blueprint(app_route)

if __name__=='__main__':
    app.run(debug=True)