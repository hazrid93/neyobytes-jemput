-- =============================================================================
-- Migration 5: Admin DELETE policy for chatbot_pool_usage + reset RPC
-- =============================================================================

-- Allow admin to DELETE chatbot usage rows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'chatbot_pool_delete_admin'
  ) THEN
    CREATE POLICY chatbot_pool_delete_admin
      ON public.chatbot_pool_usage FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- RPC: Reset pool usage — admin only
-- mode: 'today' = delete today's row, 'all' = delete all rows for the pool
CREATE OR REPLACE FUNCTION public.reset_chat_pool_usage(
  p_pool_key text,
  p_mode     text DEFAULT 'today'
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted integer;
BEGIN
  -- Only admins may call this
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  IF p_mode = 'today' THEN
    DELETE FROM public.chatbot_pool_usage
    WHERE pool_key = p_pool_key AND date = CURRENT_DATE;
  ELSE
    DELETE FROM public.chatbot_pool_usage
    WHERE pool_key = p_pool_key;
  END IF;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  RETURN jsonb_build_object('success', true, 'deleted', v_deleted);
END;
$$;
