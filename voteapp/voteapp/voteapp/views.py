from django.shortcuts import render
import redis

def index(request):
    return render(request, "index.html")

def register_vote(request, pet_type):
    set_vote(pet_type)
    broadcast_vote_event(pet_type)
    return render(request, "index.html", {"message": f"Vote Regstered Successfully For {pet_type}!"})

def connect_redis():
    try:
        return redis.Redis(host="localhost", port=6379)
    except ConnectionError:
        print("Connection error")

def broadcast_vote_event(pet_type):
    rclient = connect_redis()
    rclient.publish("VoteRegistered", pet_type)
    

def set_vote(pet_type):
    rclient = connect_redis()
    if rclient.exists(pet_type):
        rclient.incr(pet_type)
    else:
        rclient.set(pet_type, 1)
    
