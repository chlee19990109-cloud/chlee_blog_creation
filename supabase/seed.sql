-- =============================================
-- Blog 플랫폼 초기 시드 데이터
-- 주의: 마이그레이션 실행 후에 이 파일을 실행하세요.
-- =============================================

-- 1. 카테고리
INSERT INTO public.categories (name)
VALUES
  ('Frontend'),
  ('Backend'),
  ('Terminal'),
  ('Design'),
  ('Database')
ON CONFLICT (name) DO NOTHING;

-- 2. 게시글 (고정 UUID 사용 - comments와 연결을 위해)
INSERT INTO public.posts (id, title, description, content, author_name, author_image, category, image_url, read_time_minutes, tags)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Understanding React Concurrency',
    'React 18 introduced concurrent features that fundamentally change how we think about rendering. Learn how to leverage transitions and suspense.',
    'Asynchronous JavaScript has evolved significantly over the years. From the callback hell of the early days to Promises, and now the syntactic sugar of async/await, handling side effects has never been cleaner.

In React 18, concurrent rendering allows the browser to interrupt, pause, resume, or abandon a render. This is a fundamental shift from the synchronous rendering model of React 17 and before.

Key features introduced:
- useTransition: marks state updates as non-urgent
- useDeferredValue: defers re-rendering for certain values
- Suspense on the server: allows streaming HTML to the client',
    'Sarah Jenkins',
    'https://i.pravatar.cc/150?u=sarah',
    'Frontend',
    '/images/react-concurrency.jpg',
    5,
    ARRAY['React', 'JavaScript']
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Scaling Microservices with Kubernetes',
    'Best practices for managing large-scale microservice architectures using Kubernetes, Helm, and GitOps workflows.',
    'Kubernetes has become the de facto standard for container orchestration. But scaling microservices effectively requires more than just deploying containers.

This article covers:
- Horizontal Pod Autoscaling (HPA)
- Resource limits and requests
- Service mesh with Istio
- GitOps with ArgoCD

The key is to understand that K8s is not just an orchestrator — it is a platform for building platforms. Use it wisely.',
    'Alex Rivera',
    'https://i.pravatar.cc/150?u=alex',
    'Backend',
    '/images/k8s-microservices.jpg',
    8,
    ARRAY['DevOps', 'K8s']
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Mastering Vim Keybindings',
    'Boost your productivity by learning the essential Vim motions and operators. Stop using the arrow keys today.',
    'Vim is legendary for its steep learning curve, but once you master its language, you move through code at the speed of thought.

Essential motions to learn first:
- h, j, k, l — left, down, up, right
- w, b, e — word forward, backward, end
- 0, ^, $ — line start (col 0), first char, end

Operators combine with motions:
- d (delete), c (change), y (yank/copy)
- Example: dw = delete word, ci" = change inside quotes',
    'Terminal Wizard',
    'https://i.pravatar.cc/150?u=wizard',
    'Terminal',
    '/images/vim-keybindings.jpg',
    4,
    ARRAY['Productivity', 'Vim']
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Dark Mode Design Patterns',
    'Creating accessible and aesthetically pleasing dark mode interfaces requires more than just inverting colors.',
    'Dark mode is a first-class feature now. Users expect it, and OS-level settings propagate it. But implementing it well is harder than it looks.

Best practices:
- Use semantic color tokens, not hardcoded hex values
- Use CSS custom properties (variables) for theme switching
- Never use pure black (#000) — use dark gray like #111 or #0d0d0d
- Ensure WCAG AA contrast ratio for all text/background combos

The prefers-color-scheme media query lets you detect the user''s OS preference and respond accordingly.',
    'Emily Chen',
    'https://i.pravatar.cc/150?u=emily',
    'Design',
    '/images/dark-mode-patterns.jpg',
    6,
    ARRAY['UI/UX', 'CSS']
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Intro to Rust for Python Developers',
    'Why Rust is gaining popularity and how Python developers can leverage its memory safety and performance.',
    'Rust offers memory safety without a garbage collector — a combination that used to be considered impossible.

For Python developers, Rust offers:
- 10-100x performance improvements for CPU-bound tasks
- No runtime errors from null pointer dereferences
- Zero-cost abstractions
- Excellent interoperability via PyO3 (write Rust, call from Python)

The borrow checker is the hardest part to learn, but once it clicks, it feels like a superpower.',
    'Alex Rivera',
    'https://i.pravatar.cc/150?u=alex',
    'Backend',
    '/images/rust-for-python.jpg',
    10,
    ARRAY['Rust', 'Python']
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Choosing the Right Database',
    'SQL vs NoSQL vs NewSQL. A comprehensive guide to selecting the database that fits your project requirements.',
    'The database you choose will affect your application for years. Get it wrong and you''ll be paying the cost every day.

Decision framework:
- Need ACID transactions? → PostgreSQL
- Need flexible schema + speed? → MongoDB
- Need global distribution? → CockroachDB or PlanetScale
- Need real-time sync? → Supabase (Postgres + Realtime)
- Need key-value at scale? → Redis or DynamoDB

There is no universally correct answer. Understand your access patterns first.',
    'Sarah Jenkins',
    'https://i.pravatar.cc/150?u=sarah',
    'Database',
    '/images/choosing-database.jpg',
    7,
    ARRAY['Database', 'SystemDesign']
  )
ON CONFLICT (id) DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  content      = EXCLUDED.content,
  author_name  = EXCLUDED.author_name,
  author_image = EXCLUDED.author_image;

-- 3. 댓글
INSERT INTO public.comments (post_id, author_name, author_image, content)
VALUES
  -- React 게시글 댓글
  ('11111111-1111-1111-1111-111111111111', 'Emily Chen',     'https://i.pravatar.cc/150?u=emily',  'This was so helpful! I finally understand the difference between useTransition and useDeferredValue.'),
  ('11111111-1111-1111-1111-111111111111', 'Alex Rivera',    'https://i.pravatar.cc/150?u=alex',   'Great article! Could you cover Suspense + error boundaries in a follow-up?'),
  -- K8s 게시글 댓글
  ('22222222-2222-2222-2222-222222222222', 'Sarah Jenkins',  'https://i.pravatar.cc/150?u=sarah',  'Excellent summary of K8s best practices, Alex! The HPA section was especially useful.'),
  ('22222222-2222-2222-2222-222222222222', 'Terminal Wizard','https://i.pravatar.cc/150?u=wizard', 'Been using ArgoCD for a year now — can confirm, GitOps is the way.'),
  -- Vim 게시글 댓글
  ('33333333-3333-3333-3333-333333333333', 'Emily Chen',     'https://i.pravatar.cc/150?u=emily',  'Vim changed my life. Never going back to arrow keys!'),
  -- 데이터베이스 게시글 댓글
  ('66666666-6666-6666-6666-666666666666', 'Alex Rivera',    'https://i.pravatar.cc/150?u=alex',   'The decision framework at the end is gold. Bookmarking this.');
