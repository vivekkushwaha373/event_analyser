import os
import bisect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import time

EVENTS_DIR = os.path.join(settings.BASE_DIR, 'events')
EVENT_FIELDS = [
    'serialno', 'version', 'account-id', 'instance-id', 'srcaddr', 'dstaddr', 'srcport', 'dstport',
    'protocol', 'packets', 'bytes', 'starttime', 'endtime', 'action', 'log-status'
]

# Global cache
events_cache = []
start_times = []

def load_events():
    print('load called')
    """Load all events from files into memory and sort by starttime."""
    global events_cache, start_times
    events_cache.clear()
    start_times.clear()

    for fname in os.listdir(EVENTS_DIR):
        fpath = os.path.join(EVENTS_DIR, fname)
        if not os.path.isfile(fpath):
            continue
        with open(fpath, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split()
                if len(parts) != len(EVENT_FIELDS):
                    continue
                event = dict(zip(EVENT_FIELDS, parts))
                try:
                    event['starttime'] = int(event['starttime'])
                    event['endtime'] = int(event['endtime'])
                except ValueError:
                    continue
                events_cache.append((event, fname))

    # Sort by starttime for binary search
    events_cache.sort(key=lambda x: x[0]['starttime'])
    start_times = [e[0]['starttime'] for e in events_cache]

# Load events at startup
load_events()


class EventSearchView(APIView):
    def post(self, request):
        search_string = request.data.get('search_string', '').strip()
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')

        t0 = time.time()
        try:
            start_time = int(start_time)
            end_time = int(end_time)
        except (TypeError, ValueError):
            return Response({'error': 'Invalid start_time or end_time'}, status=status.HTTP_400_BAD_REQUEST)

        # Binary search to find relevant range
        left = bisect.bisect_left(start_times, start_time)
        results = []
        for i in range(left, len(events_cache)):
            event, fname = events_cache[i]
            if event['starttime'] > end_time:
                break
            if event['endtime'] < start_time:
                continue

            # Search filter
            match = False
            if '=' in search_string:
                field, value = search_string.split('=', 1)
                if field in event and event[field] == value:
                    match = True
            elif search_string:
                if search_string in str(event.values()):
                    match = True
            else:
                match = True

            if match:
                results.append({'event': event, 'file': fname})
        
        t1 = time.time()
        search_time = round(t1 - t0, 3)

        return Response({
            'results': results,
            'search_time': search_time,
            'count': len(results)
        }, status=status.HTTP_200_OK)

