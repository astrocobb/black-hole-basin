DROP TABLE IF EXISTS monitoring_wells;

CREATE TABLE IF NOT EXISTS monitoring_wells
(
    id             UUID PRIMARY KEY,
    depth_to_water CHAR(32), -- Depth to Water Below Land Surface in ft.
    site_no        CHAR(128), -- Identifying number for each monitoring well
    time           TIMESTAMPTZ, -- Time reading was taken
    water_level    CHAR(32)  -- Water level in feet relative to NAVD88
);

