from rest_framework.views import APIView
from rest_framework.response import Response
import json
import random


class ListDice(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            count = data['count']
        except Exception:
            return Response({'error': 'count is missing'}, status=500)
        res = []
        for _ in range(count):
            res.append(random.randrange(1, 7))
        return Response(res)
