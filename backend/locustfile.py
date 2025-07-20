from locust import HttpUser, task

class MyUser(HttpUser):
    @task
    def search_events(self):
        payload = {
            "search_string": "dstaddr=221.181.27.227",  # or any value you want to search
            "start_time": 1717200000,  # example timestamp
            "end_time": 1717286400     # example timestamp
        }
        self.client.post("/api/search/", json=payload)