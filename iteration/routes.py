from flask import Flask,Blueprint, render_template
app_route=Blueprint('app_route',__name__,static_folder='static',template_folder='templates')

@app_route.route('/')
def index():
    return render_template('index.html')

@app_route.route('/home')
def home():
    return render_template('home.html')