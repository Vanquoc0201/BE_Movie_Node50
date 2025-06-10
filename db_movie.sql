CREATE TABLE `TABLE_TEMPLATE` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Users` (
	`userId` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	`taiKhoan` VARCHAR(100) UNIQUE,
	`hoTen` VARCHAR (100),
	`email` VARCHAR(100) UNIQUE NOT NULL,
	`soDt` VARCHAR(100),
	`matKhau` VARCHAR(100),
	`loaiNguoiDung` VARCHAR(100),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
ALTER TABLE `Users` ADD UNIQUE(`taiKhoan`);
CREATE TABLE `Movies` (
	`maPhim` INT PRIMARY KEY NOT NULL, -- mặc định luôn luôn có
	`tenPhim` VARCHAR(100),
	`trailerPhim` VARCHAR(255),
	`hinhAnh` VARCHAR(255),
	`moTa` VARCHAR(255),
	`ngayKhoiChieu` DATE,
	`danhGia` INT,
	`hot` BOOLEAN,
	`dangChieu` BOOLEAN,
	`sapChieu` BOOLEAN,
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
-- BƯỚC 1: Thêm cột trangThai vào bảng Movies
ALTER TABLE Movies
ADD COLUMN trangThai ENUM('DangChieu', 'SapChieu', 'NgungChieu') DEFAULT 'DangChieu';

-- BƯỚC 2: Cập nhật dữ liệu trangThai từ cột dangChieu và sapChieu
UPDATE Movies
SET trangThai = 
  CASE 
    WHEN dangChieu = 1 THEN 'DangChieu'
    WHEN sapChieu = 1 THEN 'SapChieu'
    ELSE 'NgungChieu'
  END;

-- BƯỚC 3: Xóa các cột cũ: dangChieu, sapChieu, hot
ALTER TABLE Movies
ADD COLUMN theLoai VARCHAR(100);

DROP COLUMN dangChieu,
DROP COLUMN sapChieu,
DROP COLUMN hot;

-- BƯỚC 4: Thêm các cột mới: thoiLuong, quocGia, dienVien
ALTER TABLE Movies
ADD COLUMN thoiLuong INT,
ADD COLUMN quocGia VARCHAR(100),
ADD COLUMN dienVien VARCHAR(255);

CREATE TABLE `Banners` (
	`maBanner` INT PRIMARY KEY NOT NULL, -- mặc định luôn luôn có
	`maPhim` INT,
	`hinhAnh` VARCHAR(255),
	FOREIGN KEY (`maPhim`) REFERENCES `Movies`(`maPhim`),
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `CinemaSystem` (
	`maHeThongRap` INT PRIMARY KEY NOT NULL, -- mặc định luôn luôn có
	`tenHeThongRap` VARCHAR(100),
	`logo` VARCHAR(255),
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `CinemaCluster` (
	`maCumRap` INT PRIMARY KEY NOT NULL, -- mặc định luôn luôn có
	`maHeThongRap` INT,
	`tenCumRap` VARCHAR(100),
	`diaChi` VARCHAR(200),
	FOREIGN KEY (`maHeThongRap`) REFERENCES `CinemaSystem`(`maHeThongRap`),
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Cinema` (
	`maRap` INT PRIMARY KEY NOT NULL , -- mặc định luôn luôn có
	`tenRap` VARCHAR(100),
	`maCumRap` INT,
	FOREIGN KEY (`maCumRap`) REFERENCES `CinemaCluster`(`maCumRap`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE `Chairs` (
	`maGhe` INT PRIMARY KEY NOT NULL , -- mặc định luôn luôn có
	`tenGhe` VARCHAR(100),
	`loaiGhe` VARCHAR(100),
	`maRap` INT,
	FOREIGN KEY (`maRap`) REFERENCES `Cinema`(`maRap`),
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `Showtimes` (
	`maLichChieu` INT PRIMARY KEY NOT NULL , -- mặc định luôn luôn có
	`maPhim` INT,
	`maRap` INT,
	`ngayGioChieu` DATE,
	`giaVe` INT,
	FOREIGN KEY (`maRap`) REFERENCES `Cinema`(`maRap`),
	FOREIGN KEY (`maPhim`) REFERENCES `Movies`(`maPhim`),

	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
-- BƯỚC 5: Thêm cột trangThai vào bảng Showtimes
ALTER TABLE Showtimes
ADD COLUMN trangThai ENUM('DangChieu', 'HetSuat', 'NgungChieu') DEFAULT 'DangChieu';
CREATE TABLE `Bookings` (
	`bookingId` INT PRIMARY KEY AUTO_INCREMENT,
	`taiKhoan` VARCHAR(100), -- mặc định luôn luôn có
	`maLichChieu` INT,
	`maGhe` INT,
	FOREIGN KEY (`taiKhoan`) REFERENCES `Users`(`taiKhoan`),
	FOREIGN KEY (`maLichChieu`) REFERENCES `Showtimes`(`maLichChieu`),
	FOREIGN KEY (`maGhe`) REFERENCES `Chairs`(`maGhe`),

	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
CREATE TABLE `BookingDetails` (
    `maBookingDetail` INT AUTO_INCREMENT PRIMARY KEY,                          -- ID chi tiết đặt vé
    `maBooking` INT NOT NULL,                                                  -- FK đến Bookings
    `maGhe` INT NOT NULL,                                                      -- FK đến Chairs
    `trangThaiGhe` ENUM('DangDat', 'DaDat') DEFAULT 'DangDat',                 -- Trạng thái ghế
    -- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP  NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`maBooking`) REFERENCES `Bookings`(`bookingId`) ON DELETE CASCADE,
    FOREIGN KEY (`maGhe`) REFERENCES `Chairs`(`maGhe`) ON DELETE CASCADE,

    -- Không cho một ghế được đặt nhiều lần trong cùng một booking
    UNIQUE (`maBooking`, `maGhe`)
);

