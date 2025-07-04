"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io();
