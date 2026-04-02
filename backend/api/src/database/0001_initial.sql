DROP TABLE IF EXISTS monitoring_wells;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users
(
    id               UUID PRIMARY KEY,
    activation_token CHAR(32),
    email            VARCHAR(128),
    hash             CHAR(97),
    name             VARCHAR(64),
    role             VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS monitoring_wells
(
    id             UUID PRIMARY KEY,
    user_id        UUID,
    site_no        CHAR(128),   -- Identifying number for each monitoring well
    date_measured  TIMESTAMPTZ, -- Time reading was taken
    water_level    CHAR(32),    -- Water level in feet relative to NAVD88
    depth_to_water CHAR(32),    -- Depth to Water Below Land Surface in ft
    FOREIGN KEY (user_id) REFERENCES users (id)
);