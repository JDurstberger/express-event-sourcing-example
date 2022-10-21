SELECT * FROM projections
WHERE id = $1
ORDER BY created_at DESC;
