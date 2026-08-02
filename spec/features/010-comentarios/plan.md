# 010 · Comentarios — Plan

## Enfoque

2 endpoints REST anidados bajo `/api/v1/tickets/{id}/comentarios`.
El service verifica acceso al ticket antes de permitir comentar.
Al crear comentario se registra evento en historial_ticket (requiere feature 009).

## Implementación

1. Crear `backend/app/schemas/comentario.py` — ComentarioCreate, ComentarioResponse.
2. Crear `backend/app/repository/comentario_repo.py` — crear, listar por ticket.
3. Crear `backend/app/services/comentario_svc.py` — verificar acceso, sanitizar, crear.
4. Crear `backend/app/routes/comentarios.py` — POST y GET.
5. Registrar router en `main.py`.
6. Probar en Postman.

## Decisiones

- **Ruta anidada** — `/api/v1/tickets/{id}/comentarios` deja claro que los
  comentarios pertenecen a un ticket específico.
- **Autor desde token** — el id_usuario del comentario viene del JWT, no del body,
  para evitar que alguien comente en nombre de otro usuario.
- **Orden ASC obligatorio** — los comentarios siempre se devuelven por fecha
  ascendente para que el hilo sea natural.
