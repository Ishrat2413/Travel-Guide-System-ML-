from flask import Flask, jsonify
import numpy as np
import pandas as pd
from pathlib import Path
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent

df = pd.read_csv(BASE_DIR / 'synthetic_travel_data.csv', sep=',')

df['accommodation_pct'] = df['accommodation_cost'] / df['total_cost']
df['food_pct'] = df['food_cost'] / df['total_cost']
df['transport_pct'] = df['transport_cost'] / df['total_cost']
df['activities_pct'] = df['activities_cost'] / df['total_cost']


X = df[['days', 'total_cost']]
y_accommodation = df['accommodation_pct']
y_food = df['food_pct']
y_transport = df['transport_pct']
y_activities = df['activities_pct']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model_accommodation = Ridge(alpha=1.0)
model_food = Ridge(alpha=1.0)
model_transport = Ridge(alpha=1.0)
model_activities = Ridge(alpha=1.0)


X_train, X_test, y_acc_train, y_acc_test = train_test_split(X_scaled, y_accommodation, test_size=0.2, random_state=42)
X_train, X_test, y_food_train, y_food_test = train_test_split(X_scaled, y_food, test_size=0.2, random_state=42)
X_train, X_test, y_trans_train, y_trans_test = train_test_split(X_scaled, y_transport, test_size=0.2, random_state=42)
X_train, X_test, y_act_train, y_act_test = train_test_split(X_scaled, y_activities, test_size=0.2, random_state=42)


model_accommodation.fit(X_train, y_acc_train)
model_food.fit(X_train, y_food_train)
model_transport.fit(X_train, y_trans_train)
model_activities.fit(X_train, y_act_train)

y_acc_pred = model_accommodation.predict(X_test)
y_food_pred = model_food.predict(X_test)
y_trans_pred = model_transport.predict(X_test)
y_act_pred = model_activities.predict(X_test)

mse_acc = mean_squared_error(y_acc_test, y_acc_pred)
mse_food = mean_squared_error(y_food_test, y_food_pred)
mse_trans = mean_squared_error(y_trans_test, y_trans_pred)
mse_act = mean_squared_error(y_act_test, y_act_pred)


app = Flask(__name__)

CORS(app) 


@app.route('/')
def root():
    return jsonify({
        "status": "ok",
        "service": "travel-guide-system-ml",
        "endpoints": [
            "/recomend/<city>/<liked>",
            "/budget/<budget>/<days>",
            "/health"
        ]
    })


@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/recomend/<string:city>/<string:liked>')

def recomend(city, liked):
    try:
        import pandas as pd
        import numpy as np
        import warnings
        warnings.filterwarnings('ignore')
        from geopy.geocoders import Nominatim
        import statsmodels.api as sm
        import matplotlib.pyplot as plt
        from sklearn.cluster import KMeans
        import difflib
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import difflib
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        df = pd.read_csv(BASE_DIR / 'list1.csv', sep=',')


        country = 'Bangladesh'
        city_names = df['District']

        longitude =[]
        latitude =[]
        geolocator = Nominatim(user_agent="a")

        # for c in city_names.values:
        #     location = geolocator.geocode(c+','+ country)

        #     latitude.append(location.latitude)
        #     longitude.append(location.longitude)

        latitude = [22.131335800000002, 22.7562851, 22.1435694, 22.6426168, 22.0084243, 22.50956015, 21.787476, 23.96059985, 23.25785445, 22.4225445, 23.420802600000002, 21.176647099999997, 23.01276015, 23.097879849999998, 22.829862050000003, 22.2540799, 22.6533525, 23.780471849999998, 23.46492195, 24.09301495, 23.1034234, 25.0005218, 24.340813750000002, 23.2340107, 23.83298355, 23.52655035, 24.72263185, 23.720304849999998, 24.02383345, 24.8881437, 23.73983725, 23.2355375, 25.093484750000002, 24.376400599999997, 22.196722, 23.6033134, 23.084244400000003, 23.494713750000003, 22.21037735, 23.94791415, 23.4674844, 23.7887446, 23.136262799999997, 22.18075885, 24.8346718, 25.06604625, 24.87347415, 24.3951559, 24.6927214, 24.08424665, 24.4175035, 24.399360700000003, 25.6428253, 25.33984255, 25.8059698, 25.9354264, 26.024471249999998, 26.3209446, 25.6245846, 25.936331, 24.33458425, 24.485147, 24.88722295, 24.89046265]

        longitude = [90.11724308050194, 90.41098391553726, 90.79040887147522, 90.1990344, 90.38268272700293, 90.00725950308801, 92.41247516698711, 91.11908934668182, 90.80665286514817, 91.73129133223367, 91.07945528172453, 92.00350503412564, 91.40492316624264, 91.97261605393894, 90.83719404500765, 91.17143993859978, 92.146897, 90.35832872412647, 89.86194536090468, 90.41041829248033, 89.90784641425343, 89.77819948691075, 90.92768329396006, 90.14460791478643, 89.9666878246911, 90.41845758111957, 90.4186807964615, 90.61261965692697, 90.81634842673736, 90.7201249, 89.5704133269708, 90.43997926336294, 90.09782523956034, 90.00787191517998, 89.71175717384688, 88.82440288839466, 89.12469365626626, 89.12546784060544, 89.4297510703042, 88.97638178421766, 89.45878579818554, 88.70198918966396, 89.54740430111607, 89.19206841371741, 89.33416187086144, 89.09226032484744, 88.73757795091454, 89.09136195234399, 88.26109260294984, 89.34446441573698, 88.62803851841296, 89.53158327303228, 88.72247038287404, 89.53926023692877, 89.6434304171128, 89.5110547, 88.93266011912964, 88.54711392409172, 89.25907830426604, 88.31168799511732, 91.42121218784305, 91.88021347310843, 91.38866912271388, 91.96559868047092]

        df['Latitude'] = latitude
        df['Longitude'] = longitude
        l2= df.iloc[ :,-1:-3:-1]
        kmeans = KMeans(18)
        kmeans.fit(l2)

        clusters = kmeans.fit_predict(l2)
        clusters = list(clusters)
        df['loc_clusters'] = clusters

        specified_districts = []
        input_city = city +" District"
        cluster = df.loc[df['District'] == input_city, 'loc_clusters']
        cluster = cluster.iloc[0]
        cities = df.loc[df['loc_clusters'] == cluster, 'District']

        for c in range(len(cities)):
            # print(cities.iloc[c])
            specified_districts.append(cities.iloc[c].split(" ")[0])



        df2 = pd.read_csv(BASE_DIR / 'place.csv', sep=',')

        filtered_df = df2[df2['District'].isin(specified_districts)]

        features= df2['Description']
        vectorizer = TfidfVectorizer()

        feature_vectors = vectorizer.fit_transform(features)

        similarity = cosine_similarity(feature_vectors)

        keyword = liked

        list_type = filtered_df['Type'].tolist()

        find_close_match = difflib.get_close_matches(keyword, list_type)

        close_match = find_close_match[0]


        index_place = filtered_df[filtered_df.Type == close_match]['index'].values[0]

        similarity_score = list(enumerate(similarity[index_place]))

        sorted_similar_place = sorted(similarity_score, key= lambda x:x[1], reverse = True)
        output = {}
        i=1
        for place in sorted_similar_place:
          index=place[0]
          place = df2[df2.index == index]['Place'].values[0]
          description = df2[df2.index == index]['Description'].values[0]
          if df2[df2.index == index]['District'].values[0] in specified_districts:
            output[i] = [place, description]
            i+=1
        return jsonify(output)
    except:
      return jsonify(None)
    


@app.route('/budget/<int:budget>/<int:days>')

def predict_budget_split(budget, days):
    input_data = np.array([[days, budget]])
    input_data_scaled = scaler.transform(input_data)
    
    accommodation_pct = model_accommodation.predict(input_data_scaled)[0]
    food_pct = model_food.predict(input_data_scaled)[0]
    transport_pct = model_transport.predict(input_data_scaled)[0]
    activities_pct = model_activities.predict(input_data_scaled)[0]
    
    accommodation_cost = budget * accommodation_pct
    food_cost = budget * food_pct
    transport_cost = budget * transport_pct
    activities_cost = budget * activities_pct
    
    output = {
       'accommodation_cost' : int(accommodation_cost),
       'food_cost' : int(food_cost),
       'transport_cost' : int(transport_cost),
       'activities_cost' : int(activities_cost)
    }
    return jsonify(output)

if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", "5001"))
    app.run(host=host, port=port, debug=True)
