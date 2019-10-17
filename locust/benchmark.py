import os, sys, random

from locust import HttpLocust, TaskSet, seq_task, task

images = [
    'brady-bellini-_hpk_92Crhs-unsplash.jpg',
    'corinne-kutz-tMI2_-r5Nfo-unsplash.jpg',
    'glenn-carstens-peters-npxXWgQ33ZQ-unsplash.jpg',
    'jesus-kiteque-wn-KYaHwcis-unsplash.jpg',
    'jonatan-pie-3l3RwQdHRHg-unsplash.jpg',
    'jonatan-pie-h8nxGssjQXs-unsplash.jpg',
    'kristopher-roller-PC_lbSSxCZE-unsplash.jpg',
    'luca-bravo-9l_326FISzk-unsplash.jpg',
    'nik-macmillan-YXemfQiPR_E-unsplash.jpg',
    'sarah-dorweiler-x2Tmfd1-SgA-unsplash.jpg',
    'simon-matzinger-twukN12EN7c-unsplash.jpg',
    'thought-catalog-505eectW54k-unsplash.jpg'
]

class BenchmarkTaskSet(TaskSet):
    @task
    def get_original_image(self):
        self.client.get(
            "/images/%s" % (random.choice(images)),
            name="GET original image"
        )

    @task
    def get_resized_image_desktop(self):
        width = random.choice([200, 300, 400, 500, 600])
        height = random.choice([200, 300, 400, 500, 600])
        self.client.get(
            "/images/%s?width=%d&height=%d" % (random.choice(images), width, height),
            name="GET resized image"
        )
    
    @task
    def get_resized_image_mobile(self):
        width = random.choice([200, 300, 400, 500, 600])
        height = random.choice([200, 300, 400, 500, 600])
        self.client.get(
            "/images/%s?width=%d&height=%d" % (random.choice(images), width, height),
            name="GET resized image mobile",
            headers={
                'user-agent': 'some-mobile'
            }
        )

class Benchmark(HttpLocust):
    task_set = BenchmarkTaskSet
    min_wait = 50
    max_wait = 100