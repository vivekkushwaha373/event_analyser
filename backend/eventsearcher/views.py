from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import time
import os
from django.conf import settings

EVENTS_DIR = os.path.join(settings.BASE_DIR, 'events')

# Event fields as per the provided format
EVENT_FIELDS = [
    'serialno', 'version', 'account-id', 'instance-id', 'srcaddr', 'dstaddr', 'srcport', 'dstport',
    'protocol', 'packets', 'bytes', 'starttime', 'endtime', 'action', 'log-status'
]

# Create your views here.

class EventSearchView(APIView):
    def post(self, request):
        search_string = request.data.get('search_string', '').strip()
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        try:
            start_time = int(start_time)
            end_time = int(end_time)
        except (TypeError, ValueError):
            return Response({'error': 'Invalid start_time or end_time'}, status=status.HTTP_400_BAD_REQUEST)

        t0 = time.time()
        results = []
        files_checked = []
        for fname in os.listdir(EVENTS_DIR):
            fpath = os.path.join(EVENTS_DIR, fname)
            if not os.path.isfile(fpath):
                continue
            files_checked.append(fname)
            with open(fpath, 'r') as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith('#'):
                        continue
                    parts = line.split()
                    if len(parts) != len(EVENT_FIELDS):
                        continue  # skip malformed lines
                    
                    event = dict(zip(EVENT_FIELDS, parts))

                    try:
                        event_start = int(event['starttime'])
                        event_end = int(event['endtime'])
                    except ValueError:
                        continue
                    # Time range filter
                    if event_end < start_time or event_start > end_time:
                        continue
                    # Search string filter
                    match = False
                    if '=' in search_string:
                        # Field-based search, e.g., dstaddr=221.181.27.227
                        field, value = search_string.split('=', 1)
                        if field in event and event[field] == value:
                            match = True
                    elif search_string:
                        # Simple value search (e.g., IP)
                        if search_string in line:
                            match = True
                    else:
                        match = True  # If no search string, match all in time range
                    if match:
                        results.append({
                            'event': event,
                            'file': fname
                        })
        t1 = time.time()
        search_time = round(t1 - t0, 3)
        return Response({
            'results': results,
            'search_time': search_time,
            'files_checked': files_checked,
            'count': len(results)
        }, status=status.HTTP_200_OK)
