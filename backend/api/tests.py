from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.test import RequestFactory, SimpleTestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from .serializers import FocusSessionSerializer, TaskSerializer
from .views import CurrentUserView, FocusSessionViewSet, TaskViewSet


class TaskSerializerTests(SimpleTestCase):
	def test_completed_task_requires_completed_at(self):
		serializer = TaskSerializer(data={'title': 'Study', 'is_completed': True})

		self.assertFalse(serializer.is_valid())
		self.assertIn('completed_at', serializer.errors)

	def test_incomplete_task_rejects_completed_at(self):
		serializer = TaskSerializer(data={
			'title': 'Study',
			'is_completed': False,
			'completed_at': '2026-04-23T10:00:00Z',
		})

		self.assertFalse(serializer.is_valid())
		self.assertIn('completed_at', serializer.errors)


class FocusSessionSerializerTests(SimpleTestCase):
	def test_end_time_must_be_after_start_time(self):
		serializer = FocusSessionSerializer(data={
			'start_time': '2026-04-23T10:00:00Z',
			'end_time': '2026-04-23T09:59:59Z',
			'duration': 25,
			'session_type': 'focus',
		})

		self.assertFalse(serializer.is_valid())
		self.assertIn('end_time', serializer.errors)

	def test_duration_must_be_positive(self):
		serializer = FocusSessionSerializer(data={
			'start_time': '2026-04-23T10:00:00Z',
			'end_time': '2026-04-23T10:25:00Z',
			'duration': 0,
			'session_type': 'focus',
		})

		self.assertFalse(serializer.is_valid())
		self.assertIn('duration', serializer.errors)


class TaskViewSetTests(SimpleTestCase):
	def test_queryset_is_scoped_and_ordered(self):
		request = RequestFactory().get('/api/tasks/')
		request.user = SimpleNamespace(username='alice')
		view = TaskViewSet()
		view.request = request

		expected_queryset = Mock(name='task_queryset')
		with patch('api.views.Task.objects') as task_manager:
			task_manager.filter.return_value.select_related.return_value.order_by.return_value = expected_queryset

			queryset = view.get_queryset()

		self.assertIs(queryset, expected_queryset)
		task_manager.filter.assert_called_once_with(user=request.user)

	def test_perform_create_sets_request_user(self):
		request = RequestFactory().post('/api/tasks/')
		request.user = SimpleNamespace(username='alice')
		view = TaskViewSet()
		view.request = request

		serializer = Mock()

		view.perform_create(serializer)

		serializer.save.assert_called_once_with(user=request.user)


class FocusSessionViewSetTests(SimpleTestCase):
	def test_queryset_is_scoped_and_ordered(self):
		request = RequestFactory().get('/api/focus-sessions/')
		request.user = SimpleNamespace(username='alice')
		view = FocusSessionViewSet()
		view.request = request

		expected_queryset = Mock(name='focus_session_queryset')
		with patch('api.views.FocusSession.objects') as session_manager:
			session_manager.filter.return_value.select_related.return_value.order_by.return_value = expected_queryset

			queryset = view.get_queryset()

		self.assertIs(queryset, expected_queryset)
		session_manager.filter.assert_called_once_with(user=request.user)


class CurrentUserViewTests(SimpleTestCase):
	def test_returns_authenticated_user(self):
		user = SimpleNamespace(
			is_authenticated=True,
			is_active=True,
			id=7,
			username='alice',
			email='alice@example.com',
			first_name='Alice',
			profile_picture=None,
			pomodo_config={'work_time': 25},
		)

		request = APIRequestFactory().get('/api/me/')
		force_authenticate(request, user=user)

		response = CurrentUserView.as_view()(request)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data['username'], 'alice')
		self.assertEqual(response.data['email'], 'alice@example.com')
